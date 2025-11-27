/**
 * Clase Circuito
 * Se encarga de comprobar el soporte del API File, leer el contenido del archivo
 * InfoCircuito.html seleccionado por el usuario y mostrarlo en la página.
 * (Mantenida del ejercicio anterior)
 */
class Circuito {
    constructor() {
        if (this.comprobarApiFile()) {
            this.leerArchivoHTML();
        }
    }

    /**
     * Verifica si el navegador soporta el uso del API File.
     */
    comprobarApiFile() {
        // ... (código comprobacion anterior) ...
        if (!(window.File && window.FileReader)) {
            const contenedorError = document.querySelector('main > section:first-of-type > article');
            const pError = document.createElement('p');
            pError.textContent = "Error: La API File no es soportada por este navegador.";
            pError.style.color = 'red';
            pError.style.fontWeight = 'bold';

            if (contenedorError) {
                contenedorError.innerHTML = '';
                const h3Static = document.createElement('h3');
                h3Static.textContent = "Detalles del Circuito";
                contenedorError.appendChild(h3Static);
                contenedorError.appendChild(pError);
            }
            console.error("API File NO soportada por el navegador.");
            return false;
        }

        const pDesarrollo = document.querySelector('main > p');
        if (pDesarrollo && pDesarrollo.textContent.includes('en desarrollo')) {
            pDesarrollo.remove();
        }
        console.log("API File soportada por el navegador.");
        return true;
    }

    /**
     * Configura el listener para el input de archivo (InfoCircuito.html).
     */
    leerArchivoHTML() {
        try {
            // Selector semántico: Busca el input[type=file] dentro de la primera <section> anidada dentro de la <section> principal de main
            const input = document.querySelector("main > section:first-of-type > section:first-of-type input[type=file]");

            if (!input) {
                console.warn("No se encontró el input file para InfoCircuito.html.");
                return;
            }

            input.addEventListener("change", (event) => {
                const archivo = event.target.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    lector.onload = (e) => this.mostrarContenido(e.target.result);
                    lector.readAsText(archivo);
                }
            });
        } catch (error) {
            console.error("Error al configurar la lectura del archivo InfoCircuito.html:", error);
        }
    }

    /**
     * Procesa el contenido HTML leído y lo representa.
     */
    mostrarContenido(contenido) {
        const parser = new DOMParser();
        const docLeido = parser.parseFromString(contenido, "text/html");
        const contenedor = document.querySelector("main > section:first-of-type > article");

        if (!contenedor) return;

        // Limpieza del Contenedor Dinámico (manteniendo el h3 estático)
        let hijo = contenedor.lastElementChild;
        const h3Static = contenedor.querySelector('h3');
        while (hijo && hijo !== h3Static) {
            contenedor.removeChild(hijo);
            hijo = contenedor.lastElementChild;
        }

        // 1. Título del Circuito
        const h2Leido = docLeido.querySelector("h2");
        if (h2Leido) {
            const h4 = document.createElement('h4');
            h4.textContent = h2Leido.textContent;
            contenedor.appendChild(h4);
        }

        // 2. Párrafos y listas (Datos, Referencias, Clasificación)
        const elementos = docLeido.querySelectorAll("body section p, body section li");

        elementos.forEach(el => {
            const p = document.createElement('p');
            p.textContent = el.textContent;
            contenedor.appendChild(p);
        });

        // 3. Imagen del circuito (ejemplo)
        const img = document.createElement('img');
        img.src = "multimedia/mugello-circuito.jpg";
        img.alt = "Mapa del circuito Internazionale del Mugello";
        img.title = "Circuito leído";
        contenedor.appendChild(img);
    }
}


/**
 * Clase CargadorSVG
 * Se encarga de leer el contenido de un archivo SVG y representarlo en el DOM.
 */
class CargadorSVG {
    constructor() {
        this.leerArchivoSVG();
    }



    /**
     * Convierte una cadena de SVG (2.0 a 1.1) y la prepara para ser adaptable
     * inyectando el viewBox y eliminando los atributos de dimensión fijos.
     */
    convertirSvgA11(svgText) {
        // Expresiones regulares para capturar width y height
        const widthMatch = svgText.match(/width="(\d+)"/);
        const heightMatch = svgText.match(/height="(\d+)"/);

        let tempSvg = svgText;

        // 1. **Extracción y Construcción del viewBox**
        let viewBoxAttr = '';
        if (widthMatch && heightMatch) {
            // Los valores son W=1000 y H=500 (extraídos de los grupos de captura)
            const w = widthMatch[1];
            const h = heightMatch[1];
            viewBoxAttr = `viewBox="0 0 ${w} ${h}"`;
        }

        // 2. **Eliminación de width y height fijos**
        tempSvg = tempSvg.replace(/width="\d+"/, '');
        tempSvg = tempSvg.replace(/height="\d+"/, '');

        // 3. **Inyección de version="1.1", viewBox y xmlns:xlink**
        // Se inserta todo justo después de <svg
        if (!tempSvg.includes('version="1.1"')) {
            tempSvg = tempSvg.replace(
                /<svg\s*/, // Busca la etiqueta de apertura <svg seguida de espacios
                // Se inserta viewBoxAttr, version="1.1", y xmlns:xlink
                `<svg ${viewBoxAttr} version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" `
            );
        }

        // El paso de conversión 2.0 -> 1.1 y la adaptabilidad quedan combinados.

        return tempSvg;
    }

    /**
     * Tarea 2: Configura el listener para el input de archivo SVG (altimetria.svg).
     */
    leerArchivoSVG() {
        try {
            // Selector semántico para el INPUT del SVG: 
            // main > segunda section > primera section anidada > input[type=file]
            const input = document.querySelector(
                "main > section:last-of-type > section:first-of-type input[type=file]"
            );

            if (!input) {
                console.warn("No se encontró el input file para altimetria.svg.");
                return;
            }

            input.addEventListener("change", (event) => {
                const archivo = event.target.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    lector.onload = (e) => this.insertarSVG(e.target.result);
                    lector.readAsText(archivo);
                }
            });
        } catch (error) {
            console.error("Error al configurar la lectura del archivo SVG:", error);
        }
    }


    /**
     * Tarea 3: Inserta el contenido del archivo SVG en un elemento HTML.
     */
    insertarSVG(contenidoSVG) {
        // Selector semántico para el CONTENEDOR del SVG: 
        // main > segunda section > article
        const contenedorPadre = document.querySelector("main > section:last-of-type > article");

        if (!contenedorPadre) {
            console.error("No se encontró el contenedor para el gráfico SVG.");
            return;
        }

        // 1. Aplicar la conversión 2.0 -> 1.1 antes de incrustar
        const svg11Content = this.convertirSvgA11(contenidoSVG);

        // 2. Limpieza del Contenedor
        contenedorPadre.innerHTML = '<h3>Perfil de Altimetría</h3>';

        // 3. Inyecta el SVG modificado (versión 1.1)
        // Usar innerHTML para incrustar el contenido SVG como elementos DOM
        contenedorPadre.innerHTML += svg11Content;

        console.log("Gráfico SVG de altimetría (Convertido a 1.1) insertado correctamente.");
    }
}

/**
 * Clase CargadorKML
 * Se encarga de la lectura del archivo KML, el parseo de coordenadas
 * y la representación del circuito en Google Maps.
 */
class CargadorKML {
    constructor() {
        // Selector semántico para el DIV anónimo del mapa:
        // main > última section > div
        this.mapContainer = document.querySelector("main > section:last-of-type > div");
        this.map = null;
        this.leerArchivoKML();
    }

    /**
     * Inicializa el mapa de Google Maps en el DIV anónimo.
     * Esta función es llamada globalmente por la API de Google Maps (callback=initMap).
     */
    initMap() {
        if (!this.mapContainer || typeof google === 'undefined' || !google.maps) {
            console.error("No se puede inicializar el mapa: Contenedor no encontrado o API de Google Maps no cargada.");
            return;
        }

        // Centro por defecto (un punto genérico, será sobrescrito por el KML)
        const defaultCenter = { lat: 40.0, lng: -4.0 };

        this.map = new google.maps.Map(this.mapContainer, {
            center: defaultCenter,
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Limpia el mensaje de texto del div.
        this.mapContainer.innerHTML = '';

        console.log("Mapa de Google Maps inicializado.");
    }

    /**
     * Tarea 4: Lectura del archivo circuito.kml
     */
    leerArchivoKML() {
        try {
            // Selector semántico para el INPUT del KML: 
            // main > última section > primera section anidada > input[type=file]
            const input = document.querySelector(
                "main > section:last-of-type > section:first-of-type input[type=file]"
            );

            if (!input) {
                console.warn("No se encontró el input file para circuito.kml.");
                return;
            }

            input.addEventListener("change", (event) => {
                const archivo = event.target.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    lector.onload = (e) => {
                        this.insertarCapaKML(e.target.result);
                    };
                    lector.readAsText(archivo);
                }
            });
        } catch (error) {
            console.error("Error al configurar la lectura del archivo KML:", error);
        }
    }

    /**
     * Parsea las coordenadas KML (lng,lat,alt) a objetos {lat: number, lng: number}.
     * @param {string} coordinatesString - Cadena de coordenadas (ej: "11.3719,43.9972,0 11.3725,43.9975,0")
     * @returns {{lat: number, lng: number}[]} Array de objetos lat/lng.
     */
    parsearCoordenadas(coordinatesString) {
        if (!coordinatesString) return [];

        // Separa los puntos por espacio y luego cada punto por coma (lng,lat,alt)
        return coordinatesString.trim().split(/\s+/).map(point => {
            const [lng, lat] = point.split(',');
            return {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
        }).filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));
    }

    /**
     * Tarea 5: Superpone el archivo KML en un mapa dinámico.
     * @param {string} contenidoKML - Contenido KML leído.
     */
    insertarCapaKML(contenidoKML) {
        if (!this.map) {
            console.warn("El mapa aún no está inicializado. Intente cargar el archivo KML de nuevo tras la carga inicial del mapa.");
            return;
        }

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contenidoKML, "text/xml");

            // 1. Extraer coordenadas del punto de origen (<Point>)
            const pointElement = xmlDoc.querySelector('Placemark Point coordinates');
            let originCoordinates = null;
            if (pointElement && pointElement.textContent) {
                const coordsArray = this.parsearCoordenadas(pointElement.textContent);
                if (coordsArray.length > 0) {
                    originCoordinates = coordsArray[0];
                }
            }

            // 2. Extraer coordenadas de la polilínea del circuito (<LineString>)
            const lineStringElement = xmlDoc.querySelector('Placemark LineString coordinates');
            let trackCoordinates = [];
            if (lineStringElement && lineStringElement.textContent) {
                trackCoordinates = this.parsearCoordenadas(lineStringElement.textContent);
            }

            // 3. Representar en el mapa
            if (originCoordinates) {
                // Centrar el mapa en el punto de origen
                this.map.setCenter(originCoordinates);
                this.map.setZoom(16); // Zoom adecuado para un circuito

                // Colocar marcador en el origen
                new google.maps.Marker({
                    position: originCoordinates,
                    map: this.map,
                    title: 'Punto de Origen (Box/Salida)'
                });

                console.log("Marcador de origen colocado correctamente.");
            }

            if (trackCoordinates.length > 1) {
                // Representar los tramos del circuito con una polilínea
                new google.maps.Polyline({
                    path: trackCoordinates,
                    geodesic: true,
                    strokeColor: '#FF0000', // Rojo para el circuito
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: this.map
                });
                console.log("Polilínea del circuito trazada correctamente.");
            } else {
                console.warn("No se pudieron extraer suficientes coordenadas para la polilínea.");
            }

        } catch (error) {
            console.error("Error al parsear o representar el archivo KML:", error);
        }
    }
}

// -------------------------------------------------------------
// Inicialización Global
// -------------------------------------------------------------

// Instancia global de la clase que maneja la lógica KML
let kmlMapLoaderInstance;

// Función global que Google Maps llama al cargarse (callback=initMap)
function initMap() {
    if (kmlMapLoaderInstance) {
        kmlMapLoaderInstance.initMap();
    }
}

// Inicializar todas las clases una vez el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
    // Inicializa Circuito y comprueba el API File.
    const circuito = new Circuito();
    const isFileAPISupported = circuito.isFileAPISupported;

    if (isFileAPISupported) {
        // Inicializa el cargador SVG
        new CargadorSVG();

        // Inicializa la instancia del mapa, la cual espera que initMap() sea llamada
        // por la API de Google Maps
        kmlMapLoaderInstance = new CargadorKML();
    }
});
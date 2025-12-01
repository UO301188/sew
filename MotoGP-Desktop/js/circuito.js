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


        const img = document.createElement('img');
        img.src = "multimedia/mugello-circuit.jpg";
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

// Inicializar ambas clases una vez el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
    const circuito = new Circuito();

    // Solo inicializar CargadorSVG si el API File es soportada
    if (circuito.comprobarApiFile()) {
        new CargadorSVG();
    }
});
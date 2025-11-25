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

// -------------------------------------------------------------
// Tarea 1: Clase CargadorSVG
// -------------------------------------------------------------

/**
 * Clase CargadorSVG
 * Se encarga de leer el contenido de un archivo SVG y representarlo en el DOM.
 */
class CargadorSVG {
    constructor() {
        // Asume que la comprobación de API File ya la hizo la clase Circuito
        this.contenedorSVG = null;
        this.leerArchivoSVG();
    }

    /**
     * Tarea 2: Configura el listener para el input de archivo SVG (altimetria.svg).
     */
    leerArchivoSVG() {
        try {
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
     * @param {string} contenidoSVG - El contenido XML/Texto del archivo altimetria.svg.
     */
    insertarSVG(contenidoSVG) {
        // Contenedor principal para la altimetría
        const contenedorPadre = document.querySelector("main > section:last-of-type > article");

        if (!contenedorPadre) {
            console.error("No se encontró el contenedor para el gráfico SVG.");
            return;
        }

        // Limpia el contenido previo del contenedor (solo el gráfico y el mensaje)
        contenedorPadre.innerHTML = '';

        // El SVG es un XML que debe ser insertado como elemento HTML (no como texto)
        // Usamos innerHTML en el contenedor para inyectar el código SVG.
        // NOTA: Para mantener la semántica y evitar el uso de DIVs o ID/Classes,
        // inyectamos el SVG directamente en el <article> dedicado.

        contenedorPadre.innerHTML = contenidoSVG;

        console.log("Gráfico SVG de altimetría insertado correctamente.");
    }
}

// Inicializar ambas clases una vez el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
    new Circuito();

    // Solo inicializar CargadorSVG si el API File es soportada (ya comprobado por Circuito)
    if (window.File && window.FileReader) {
        new CargadorSVG();
    }
});
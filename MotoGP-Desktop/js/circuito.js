/**
 * Clase Circuito
 * Se encarga de comprobar el soporte del API File, leer el contenido del archivo
 * InfoCircuito.html seleccionado por el usuario y mostrarlo en la página,
 * cumpliendo con las restricciones de ECMAScript puro y selectores semánticos.
 */
class Circuito {
    constructor() {
        // 1. Comprueba el soporte del API File. Si es compatible, continúa.
        if (this.comprobarApiFile()) {
            this.leerArchivoHTML();
        }
    }

    /**
     * Tarea 2: Verifica si el navegador soporta el uso del API File.
     * Muestra un mensaje al usuario si no está soportado.
     * @returns {boolean} True si la API File es soportada, False en caso contrario.
     */
    comprobarApiFile() {
        if (!(window.File && window.FileReader)) {
            // Selector semántico para el artículo contenedor
            const contenedorError = document.querySelector('main > section:first-of-type > article');

            // Creación del elemento de mensaje de error (Vanilla JS)
            const pError = document.createElement('p');
            pError.textContent = "Error: La API File no es soportada por este navegador.";
            pError.style.color = 'red';
            pError.style.fontWeight = 'bold';

            // Limpia el contenido (manteniendo el h3 estático si ya existe)
            if (contenedorError) {
                contenedorError.innerHTML = '';
                // Se recrea el encabezado semántico del artículo que se borró con innerHTML = ''
                const h3Static = document.createElement('h3');
                h3Static.textContent = "Detalles del Circuito";
                contenedorError.appendChild(h3Static);
                contenedorError.appendChild(pError);
            }
            console.error("API File NO soportada por el navegador.");
            return false;
        }

        // Si la API es soportada, elimina el mensaje "en desarrollo"
        const pDesarrollo = document.querySelector('main > p');
        if (pDesarrollo && pDesarrollo.textContent.includes('en desarrollo')) {
            pDesarrollo.remove();
        }

        console.log("API File soportada por el navegador.");
        return true;
    }

    /**
     * Tarea 3: Configura el listener para el input de archivo.
     */
    leerArchivoHTML() {
        try {
            // Selector robusto sin ID/Class: Busca el input[type=file] en cualquier parte dentro de <main>
            const input = document.querySelector("main input[type=file]");

            if (!input) {
                console.warn("No se encontró el input file.");
                return;
            }

            // Añadir el listener al evento 'change' del input
            input.addEventListener("change", (event) => {
                const archivo = event.target.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    // Cuando la lectura sea exitosa, llama a mostrarContenido
                    lector.onload = (e) => this.mostrarContenido(e.target.result);
                    // Inicia la lectura del archivo como texto
                    lector.readAsText(archivo);
                }
            });
        } catch (error) {
            console.error("Error al configurar la lectura del archivo:", error);
        }
    }

    /**
     * Tarea 4: Procesa el contenido HTML leído y lo representa en circuito.html.
     */
    mostrarContenido(contenido) {
        const parser = new DOMParser();
        // Parsear el contenido de texto como un documento HTML
        const docLeido = parser.parseFromString(contenido, "text/html");

        // Contenedor donde se mostrará la información (el article)
        const contenedor = document.querySelector("main > section:first-of-type > article");

        if (!contenedor) {
            console.error("No se encontró el contenedor de la información del circuito.");
            return;
        }

        // --- Limpieza del Contenedor Dinámico ---
        // Eliminar todos los hijos del <article> excepto el <h3> estático ("Detalles del Circuito")
        let hijo = contenedor.lastElementChild;
        const h3Static = contenedor.querySelector('h3');
        while (hijo && hijo !== h3Static) {
            contenedor.removeChild(hijo);
            hijo = contenedor.lastElementChild;
        }

        // 1. Obtener y mostrar el Título del Circuito (H2 del archivo leído)
        const h2Leido = docLeido.querySelector("h2");
        if (h2Leido) {
            // Usamos <h4> para mantener la jerarquía (H2 de la página > H3 estático > H4 del circuito)
            const h4 = document.createElement('h4');
            h4.textContent = h2Leido.textContent;
            contenedor.appendChild(h4);
        }

        // 2. Obtener y mostrar los párrafos y listas (datos, referencias y clasificación)
        const elementos = docLeido.querySelectorAll("body section p, body section li");

        elementos.forEach(el => {
            const p = document.createElement('p');
            p.textContent = el.textContent;
            contenedor.appendChild(p);
        });

        // 3. Mostrar una imagen del circuito (ejemplo)
        const img = document.createElement('img');
        img.src = "multimedia/mugello-circuit.jpg";
        img.alt = "Mapa del circuito Internazionale del Mugello";
        img.title = "Circuito leído";
        contenedor.appendChild(img);



    }
}

// Inicializar la clase Circuito una vez el DOM esté completamente cargado
window.addEventListener("DOMContentLoaded", () => {
    new Circuito();
});
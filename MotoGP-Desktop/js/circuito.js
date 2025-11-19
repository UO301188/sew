class Circuito {
    constructor() {
        // No asumimos que el DOM está listo cuando se crea la instancia desde fuera.
        this.comprobarApiFile();
        this.leerArchivoHTML();
        
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File soportada por el navegador.");
        } else {
            const cont = document.getElementById("contenidoCircuito");
            if (cont) {
                cont.innerHTML = "<p>Tu navegador no soporta la API File de HTML5.</p>";
            } else {
                console.error("Tu navegador no soporta la API File de HTML5 y no existe #contenidoCircuito.");
            }
        }
    }

    leerArchivoHTML() {
        const input = document.getElementById('fileInput');
        if (!input) {
            console.warn("No se encontró el elemento #fileInput. Asegúrate de que circuito.html contiene el input.");
            return;
        }
        input.addEventListener('change', (event) => {
            const archivo = event.target.files[0];
            if (archivo) {
                const lector = new FileReader();
                lector.onload = (e) => {
                    const contenido = e.target.result;
                    this.mostrarContenido(contenido);
                };
                lector.readAsText(archivo);
            }
        });
    }

    cargarDesdeRutaRelativa() {
        // Intenta obtener el archivo si la app se sirve desde un servidor (http://...)
        const ruta = "xml/InfoCircuito.html";
        fetch(ruta).then(resp => {
            if (!resp.ok) throw new Error("No encontrado o acceso denegado");
            return resp.text();
        }).then(texto => {
            this.mostrarContenido(texto);
        }).catch(err => {
            // No se pudo cargar automáticamente; se mantiene el input file como fallback.
            console.info(`No se pudo cargar ${ruta} automáticamente: ${err.message}`);
        });
    }

    mostrarContenido(contenido) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, "text/html");

        const contenedor = document.getElementById("contenidoCircuito");
        if (!contenedor) {
            console.error("No existe el contenedor #contenidoCircuito en la página.");
            return;
        }
        contenedor.innerHTML = ""; // Limpiar contenido previo

        // Extraer título del circuito
        const titulo = doc.querySelector("h2") ? doc.querySelector("h2").textContent : "Circuito";
        contenedor.innerHTML += `<h3>${titulo}</h3>`;

        // Extraer párrafos y listas (p y li)
        const elementos = doc.querySelectorAll("p, li");
        elementos.forEach(el => {
            contenedor.innerHTML += `<p>${el.textContent}</p>`;
        });

        
    }
}
// ...existing code...
/* Instanciar la clase una vez cargado el DOM */
window.addEventListener("DOMContentLoaded", () => {
    const circuito = new Circuito();
});
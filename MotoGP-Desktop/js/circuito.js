class Circuito {
    constructor() {
        this.comprobarApiFile();
        this.leerArchivoHTML();
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File soportada por el navegador.");
        } else {
            // Contenedor = <main> > section > section
            const cont = document.querySelector("main section section");
            if (cont) {
                cont.innerHTML = "<p>Tu navegador no soporta la API File de HTML5.</p>";
            } else {
                console.error("Contenedor no encontrado en el DOM.");
            }
        }
    }

    leerArchivoHTML() {
        // Input = <main> > section > input[type=file]
        const input = document.querySelector("main section input[type='file']");
        if (!input) {
            console.warn("No se encontró el input dentro de <main><section>.");
            return;
        }

        input.addEventListener("change", (event) => {
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

    mostrarContenido(contenido) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, "text/html");

        // Contenedor donde se muestra todo
        const contenedor = document.querySelector("main section section");
        if (!contenedor) {
            console.error("No existe el contenedor dentro de <main><section><section>.");
            return;
        }
        contenedor.innerHTML = "";

        // Título del circuito
        const titulo = doc.querySelector("h2") ? doc.querySelector("h2").textContent : "Circuito";
        contenedor.innerHTML += `<h3>${titulo}</h3>`;

        // Párrafos y listas
        const elementos = doc.querySelectorAll("p, li");
        elementos.forEach(el => {
            contenedor.innerHTML += `<p>${el.textContent}</p>`;
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const circuito = new Circuito();
});

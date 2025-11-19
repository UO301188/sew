class Circuito {
    constructor() {
        this.comprobarApiFile();
        this.leerArchivoHTML();
    }

    comprobarApiFile() {
        if (window.File && window.FileReader) {
            console.log("API File soportada por el navegador.");
        }
    }

    leerArchivoHTML() {
        const input = document.querySelector("input[type=file]");
        if (!input) {
            console.warn("No se encontró el input file.");
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
    }

    mostrarContenido(contenido) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(contenido, "text/html");

        const contenedor = document.querySelector("main section section");
        contenedor.innerHTML = "";

        const titulo = doc.querySelector("h2")?.textContent ?? "Circuito";
        contenedor.innerHTML += `<h3>${titulo}</h3>`;

        const elementos = doc.querySelectorAll("p, li");
        elementos.forEach(el => {
            contenedor.innerHTML += `<p>${el.textContent}</p>`;
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new Circuito();
});

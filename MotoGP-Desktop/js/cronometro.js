/* Clase Cronometro: controla el tiempo en minutos, segundos y décimas de segundo */

class Cronometro {
    constructor() {
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
    }

    arrancar() {
        try {
            this.inicio = Temporal.Now.instant();
            console.log("Usando Temporal para medir el tiempo.");
        } catch (error) {
            this.inicio = new Date();
            console.log("Temporal no disponible. Usando Date.");
        }
        // Llamamos a actualizar cada 0.1 segundos (100 ms)
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    actualizar() {
        try {
            // Obtenemos el momento actual
            const ahora = Temporal.Now.instant();

            // Calculamos la duración transcurrida desde el inicio
            const duracion = ahora.since(this.inicio, { smallestUnit: "milliseconds" });

            // Guardamos el tiempo transcurrido en el atributo tiempo
            this.tiempo = duracion.total({ unit: "milliseconds" });
        } catch (error) {
            const ahora = new Date();
            this.tiempo = ahora - this.inicio;
        }
        this.mostrar();
    }

    /* ----------- NUEVO: Métodos de utilidad (Tarea 5) ----------- */

    mostrar() {
        // Descomponemos el tiempo (en milisegundos) en minutos, segundos y décimas
        const minutos = parseInt(this.tiempo / 60000);
        const segundos = parseInt((this.tiempo % 60000) / 1000);
        const decimas = parseInt((this.tiempo % 1000) / 100); // décimas = cada 100 ms

        // Formateamos con ceros delante
        const mm = String(minutos).padStart(2, "0");
        const ss = String(segundos).padStart(2, "0");

        // Creamos la cadena final en formato mm:ss.s
        const texto = `${mm}:${ss}.${decimas}`;

        // Mostramos en el primer <p> dentro de <main>
        const parrafo = document.querySelector("main p");
        if (parrafo) {
            parrafo.textContent = texto;
        }

        // (Opcional para depuración)
        console.log(texto);
    }

    parar() {
        // Detiene el intervalo
        clearInterval(this.corriendo);
        this.corriendo = null;
    }

    reiniciar() {
        // Detiene el cronómetro
        clearInterval(this.corriendo);
        this.corriendo = null;

        // Pone el tiempo a cero
        this.tiempo = 0;

        // Actualiza la visualización
        this.mostrar();
    }
}

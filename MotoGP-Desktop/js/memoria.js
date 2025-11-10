"use strict";

class Memoria {
    #tableroBloqueado;
    #primeraCarta;
    #segundaCarta;
    #cronometro;

    constructor() {
        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
        this.#cronometro = new Cronometro();

        window.addEventListener("DOMContentLoaded", () => this.#inicializar());
    }

    #inicializar() {
        this.#barajarCartas();
        this.#asignarEventos();
        this.#cronometro.arrancar();
    }

    #asignarEventos() {
        const cartas = document.querySelectorAll("main article");
        cartas.forEach(carta => {
            carta.addEventListener("click", () => this.flipCard(carta));
            carta.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") this.flipCard(carta);
            });
        });
    }

    flipCard(carta) {
        if (this.#tableroBloqueado) return;
        if (carta.dataset.state === "flip" || carta.dataset.state === "revelada") return;

        carta.dataset.state = "flip";

        if (!this.#primeraCarta) {
            this.#primeraCarta = carta;
            return;
        }

        this.#segundaCarta = carta;
        this.#comprobarPareja();
    }

    #barajarCartas() {
        const main = document.querySelector("main");
        const cartas = Array.from(main.querySelectorAll("article"));
        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        const marcador = main.querySelector("#cronometro");
        cartas.forEach(carta => marcador.insertAdjacentElement("afterend", carta));
        this.#tableroBloqueado = false;
    }

    #reiniciarAtributos() {
        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
    }

    #deshabilitarCartas() {
        this.#primeraCarta.dataset.state = "revelada";
        this.#segundaCarta.dataset.state = "revelada";

        this.#primeraCarta.onclick = null;
        this.#segundaCarta.onclick = null;

        this.#comprobarFinJuego();
        this.#reiniciarAtributos();
    }

    #cubrirCartas() {
        this.#tableroBloqueado = true;
        setTimeout(() => {
            this.#primeraCarta.removeAttribute("data-state");
            this.#segundaCarta.removeAttribute("data-state");
            this.#reiniciarAtributos();
        }, 1500);
    }

    #comprobarPareja() {
        const src1 = this.#primeraCarta.querySelector("img").src;
        const src2 = this.#segundaCarta.querySelector("img").src;
        src1 === src2 ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }

    #comprobarFinJuego() {
        const cartas = document.querySelectorAll("main article");
        const todasReveladas = Array.from(cartas).every(c => c.dataset.state === "revelada");
        if (todasReveladas) {
            this.#cronometro.parar();
            alert("🎉 ¡Has ganado! Todas las cartas están emparejadas.");
        }
    }
}


const juegoMemoria = new Memoria();

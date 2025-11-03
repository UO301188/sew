class Memoria{
    constructor(){
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;

        window.addEventListener("DOMContentLoaded", () => {
            this.barajarCartas();
        });
    }
    
    flipCard(card) {
        if (this.tablero_bloqueado) return; // si el tablero está bloqueado, no hacer nada
        card.dataset.state = "flip"; // añade o modifica el atributo data-state
    }

    barajarCartas() {
        const main = document.querySelector("main");
        if (!main) return;

        // Obtenemos todos los artículos (las cartas)
        const cartas = Array.from(main.querySelectorAll("article"));

        // Si no hay cartas, salimos
        if (cartas.length === 0) return;

        // Barajar las cartas con algoritmo Fisher-Yates
        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        // Reinsertamos las cartas en el nuevo orden
        cartas.forEach(carta => main.appendChild(carta));

        this.tablero_bloqueado = false;
    }

    reiniciarAtributos(){
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    deshabilitarCartas(){
        if (this.primera_carta && this.segunda_carta){
            // Cambiamos su estado para que queden reveladas permanentemente
            this.primera_carta.dataset.state = "revelada";
            this.segunda_carta.dataset.state = "revelada";

            // Quitamos la posibilidad de hacer clic de nuevo
            this.primera_carta.onclick = null;
            this.segunda_carta.onclick = null;

            this.comprobarFinJuego();

            // Reiniciamos los atributos para la siguiente jugada
            this.reiniciarAtributos();
        }
    }

    comprobarFinJuego() {
        // Seleccionamos todas las cartas del tablero
        const cartas = document.querySelectorAll("main article");
        // Convertimos a array y comprobamos si todas están reveladas
        const todasReveladas = Array.from(cartas).every(
            carta => carta.dataset.state === "revelada"
        );

        if (todasReveladas) {
            alert("🎉 ¡Has ganado! Todas las cartas están emparejadas.");
        }
    }
}

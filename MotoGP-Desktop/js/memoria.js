class Memoria{
    constructor() {
        // Inicializamos los atributos
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;

        // Esperamos a que el documento esté listo antes de barajar
        window.addEventListener("DOMContentLoaded", () => {
            this.barajarCartas();
            this.tablero_bloqueado = false; // desbloqueamos tras barajar
        });

        this.cronometro = new Cronometro();
        this.cronometro.arrancar();
    }

    
    flipCard(card) {
        // 1. Evitar acciones no válidas
        if (this.tablero_bloqueado) return;
        if (card.dataset.state === "flip" || card.dataset.state === "revelada") return;

        // 2. Voltear la carta
        card.dataset.state = "flip";

        // 3. Lógica de primera o segunda carta
        if (!this.primera_carta) {
            // Primera carta volteada
            this.primera_carta = card;
            return;
        }

        // Segunda carta volteada
        this.segunda_carta = card;

        // 4. Comprobar si forman pareja
        this.comprobarPareja();
    }


   barajarCartas() {
        const main = document.querySelector("main");
        if (!main) return;

        // Obtenemos solo los artículos (las cartas)
        const cartas = Array.from(main.querySelectorAll("article"));

        // Si no hay cartas, salimos
        if (cartas.length === 0) return;

        // Barajar las cartas con algoritmo Fisher-Yates
        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
        }

        // Reinsertamos las cartas en el nuevo orden, después del párrafo del cronómetro
        // Revisar
        const parrafoCronometro = main.querySelector("#cronometro");
        cartas.forEach(carta => parrafoCronometro.insertAdjacentElement("afterend", carta));

        this.tablero_bloqueado = false;
    }


    reiniciarAtributos(){
        this.tablero_bloqueado = false;
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
            this.cronometro.parar();
            alert("🎉 ¡Has ganado! Todas las cartas están emparejadas.");
        }
    }

    cubrirCartas() {
        // Bloqueamos el tablero temporalmente para evitar clics durante la animación
        this.tablero_bloqueado = true;

        // Esperamos 1.5 segundos (1500 ms) antes de cubrir las cartas
        setTimeout(() => {
            // Quitamos el atributo data-state a las dos cartas para volverlas boca abajo
            this.primera_carta.removeAttribute("data-state");
            this.segunda_carta.removeAttribute("data-state");

            // Reiniciamos los atributos del juego (bloqueo, referencias a cartas, etc.)
            this.reiniciarAtributos();
        }, 1500);
    }
    comprobarPareja() {
        // Obtenemos las imágenes dentro de las dos cartas seleccionadas
        const img1 = this.primera_carta.querySelector("img");
        const img2 = this.segunda_carta.querySelector("img");

        // Obtenemos el valor del atributo src (la ruta de la imagen)
        const src1 = img1.getAttribute("src");
        const src2 = img2.getAttribute("src");

        // Comprobamos si las imágenes son iguales con operador ternario
        src1 === src2 ? this.deshabilitarCartas() : this.cubrirCartas();
    }


}

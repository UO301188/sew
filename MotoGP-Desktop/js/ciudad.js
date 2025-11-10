"use strict";

class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.cantidadPoblacion = 0;
        this.coordenadas = { latitud: 0, longitud: 0 };
    }

    fillAtributes() {
        this.cantidadPoblacion = 7164;
        this.coordenadas = { latitud: 43.9936, longitud: 11.3542 };
    }

    getNombreCiudad() { return this.nombre; }
    getPais() { return this.pais; }

    getInfoSecundaria() {
        return `
        <section aria-label="Información secundaria">
            <h3>Información secundaria</h3>
            <ul>
                <li>Gentilicio: ${this.gentilicio}</li>
                <li>Población: ${this.cantidadPoblacion.toLocaleString()}</li>
            </ul>
        </section>`;
    }

    getCoordenadasHTML() {
        return `
        <section aria-label="Coordenadas">
            <p>Coordenadas de ${this.nombre}:</p>
            <ul>
                <li>Latitud: ${this.coordenadas.latitud}</li>
                <li>Longitud: ${this.coordenadas.longitud}</li>
            </ul>
        </section>`;
    }
}

/* --- Instanciación y manipulación del DOM --- */


window.addEventListener("DOMContentLoaded", () => {
    const scarperia = new Ciudad("Scarperia", "Italia", "scarperiense");
    scarperia.fillAtributes();

    const mainEl = document.querySelector("main");

    const cityH2 = document.createElement("h2");
    cityH2.textContent = `Ciudad: ${scarperia.getNombreCiudad()}`;
    mainEl.appendChild(cityH2);

    const paisP = document.createElement("p");
    paisP.textContent = `País: ${scarperia.getPais()}`;
    mainEl.appendChild(paisP);

    mainEl.insertAdjacentHTML("beforeend", scarperia.getInfoSecundaria());
    mainEl.insertAdjacentHTML("beforeend", scarperia.getCoordenadasHTML());
});

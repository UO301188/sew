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
        // Coordenadas del circuito de Mugello (Scarperia, Italia)
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

    /* ==============================
       MÉTODOS DE METEOROLOGÍA
       ============================== */

    getMeteorologiaCarrera() {
        // Ejemplo: día de la carrera del GP de Italia 2025
        const fechaCarrera = "2025-06-22";
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${this.coordenadas.latitud}&longitude=${this.coordenadas.longitud}&start_date=${fechaCarrera}&end_date=${fechaCarrera}&hourly=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset&timezone=auto`;

        const self = this;

        $.ajax({
            dataType: "json",
            url: url,
            success: function (datos) {
                self.procesarJSONCarrera(datos);
            },
            error: function () {
                $("main").append("<p>Error al obtener los datos meteorológicos del día de la carrera.</p>");
            }
        });
    }

    // --- MÉTODO MODIFICADO ---
    procesarJSONCarrera(datos) {
        const horas = datos.hourly.time;
        const temp = datos.hourly.temperature_2m;
        const sensacion = datos.hourly.apparent_temperature;
        const lluvia = datos.hourly.precipitation;
        const humedad = datos.hourly.relative_humidity_2m;
        const vientoVel = datos.hourly.wind_speed_10m;
        const vientoDir = datos.hourly.wind_direction_10m;

        const salidaSol = datos.daily.sunrise[0];
        const puestaSol = datos.daily.sunset[0];

        // Mostrar en HTML
        let seccion = $("<section></section>").append("<h3>Meteorología día de carrera</h3>");
        seccion.append(`<p><strong>Salida del sol:</strong> ${salidaSol}</p>`);
        seccion.append(`<p><strong>Puesta del sol:</strong> ${puestaSol}</p>`);

        let lista = $("<ul></ul>");
        for (let i = 0; i < horas.length; i += 2) { // mostramos cada 2 horas
            const horaRaw = horas[i];
            const horaLegible = horaRaw.replace("T", " Time: ");

            // --- NUEVA LÓGICA: Detectar las 14:00 ---
            let marcadorCarrera = "";
            // Buscamos la cadena "T14:00" que es el formato estándar de la API
            if (horaRaw.includes("T14:00")) {
                marcadorCarrera = ' <span >🚩 HORA DE INICIO DE LA CARRERA</span>';
            }

            lista.append(`<li><strong>${horaLegible}</strong>${marcadorCarrera}: ${temp[i]}°C, sensación ${sensacion[i]}°C, lluvia ${lluvia[i]} mm, humedad ${humedad[i]}%, viento ${vientoVel[i]} km/h (${vientoDir[i]}°)</li>`);
        }
        seccion.append(lista);
        $("main").append(seccion);
    }
    // -------------------------

    getMeteorologiaEntrenos() {
        // Tres días antes de la carrera
        const start = "2025-06-20";
        const end = "2025-06-21";
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${this.coordenadas.latitud}&longitude=${this.coordenadas.longitud}&start_date=${start}&end_date=${end}&hourly=temperature_2m,precipitation,wind_speed_10m,relative_humidity_2m&timezone=auto`;

        const self = this;

        $.ajax({
            dataType: "json",
            url: url,
            success: function (datos) {
                self.procesarJSONEntrenos(datos);
            },
            error: function () {
                $("main").append("<p>Error al obtener los datos meteorológicos de entrenamientos.</p>");
            }
        });
    }

    procesarJSONEntrenos(datos) {
        const horas = datos.hourly.time;
        const temp = datos.hourly.temperature_2m;
        const lluvia = datos.hourly.precipitation;
        const viento = datos.hourly.wind_speed_10m;
        const humedad = datos.hourly.relative_humidity_2m;

        const dias = {};
        for (let i = 0; i < horas.length; i++) {
            const dia = horas[i].split("T")[0];
            if (!dias[dia]) dias[dia] = { temp: [], lluvia: [], viento: [], humedad: [] };
            dias[dia].temp.push(temp[i]);
            dias[dia].lluvia.push(lluvia[i]);
            dias[dia].viento.push(viento[i]);
            dias[dia].humedad.push(humedad[i]);
        }

        let seccion = $("<section></section>").append("<h3>Promedios de los días de entrenamientos</h3>");
        for (const dia in dias) {
            const media = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
            seccion.append(`
                <p><strong>${dia}</strong>: 
                Temperatura media ${media(dias[dia].temp)}°C, 
                Lluvia media ${media(dias[dia].lluvia)} mm, 
                Viento medio ${media(dias[dia].viento)} km/h, 
                Humedad media ${media(dias[dia].humedad)}%</p>
            `);
        }
        $("main").append(seccion);
    }
}

/* ==============================
   Inicialización al cargar la página
   ============================== */
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

    // Llamadas a la API con jQuery
    $(document).ready(function () {
        scarperia.getMeteorologiaCarrera();
        scarperia.getMeteorologiaEntrenos();
    });
});
"use strict";

class Noticias {
    constructor(busqueda) {
        this.busqueda = busqueda;
        this.urlBase = "https://api.thenewsapi.com/v1/news/all";

        this.apiKey = "dO337DVRpytmS0exxCuxOh4t5zM0rK5xS9nQfKtS";
    }

    async buscar() {
        const url = `${this.urlBase}?api_token=${this.apiKey}&search=${encodeURIComponent(this.busqueda)}&language=es&limit=5`;

        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            this.procesarInformacion(datos);
        } catch (error) {
            console.error("Error al obtener noticias:", error);
            $("main").append(`<p>Error al cargar noticias: ${error.message}</p>`);
        }
    }

    procesarInformacion(datos) {
        if (!datos.data || datos.data.length === 0) {
            $("main").append("<p>No se encontraron noticias sobre MotoGP.</p>");
            return;
        }

        // Creamos la sección principal
        const seccionNoticias = $(`
            <section id="noticias">
                <h2>Últimas noticias de MotoGP</h2>
            </section>
        `);

        // Recorremos cada noticia del JSON
        datos.data.forEach(noticia => {
            const titulo = noticia.title || "Sin título";
            const resumen = noticia.description || "Sin descripción disponible.";
            const fuente = noticia.source || "Fuente desconocida";
            const enlace = noticia.url || "#";
            const imagen = noticia.image_url || "multimedia/imagenNoDisponible.png";

            const articulo = $(`
                <article class="noticia">
                    <img src="${imagen}" alt="Imagen noticia">
                    <div class="contenido">
                        <h3>${titulo}</h3>
                        <p>${resumen}</p>
                        <p><strong>Fuente:</strong> ${fuente}</p>
                        <a href="${enlace}" target="_blank">Leer más</a>
                    </div>
                </article>
            `);

            seccionNoticias.append(articulo);
        });

        // Insertamos la sección justo después del carrusel
        $("main").append(seccionNoticias);
    }
}

// Esperar a que cargue el DOM y ejecutar la búsqueda
$(document).ready(function () {
    const noticiasMotoGP = new Noticias("MotoGP");
    noticiasMotoGP.buscar();
});

"use strict";

class Carrusel {
    constructor(busqueda) {
        this.busqueda = busqueda;
        this.actual = 0;
        this.maximo = 4;
        this.fotos = [];
    }

    getFotografias() {
        const apiKey = "TU_API_KEY_AQUI"; // Sustituir por tu clave
        const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search"
            + "&api_key=" + apiKey
            + "&text=" + encodeURIComponent(this.busqueda)
            + "&per_page=5"
            + "&format=json"
            + "&nojsoncallback=1";

        $.ajax({
            url: url,
            dataType: "json",
            success: (datos) => this.procesarJSONFotografias(datos),
            error: function() {
                console.error("Error al obtener las fotografías del circuito");
            }
        });
    }

    procesarJSONFotografias(datos) {
        if (datos.stat === "ok") {
            const fotos = datos.photos.photo;
            this.fotos = fotos.slice(0, 5).map(foto =>
                `https://live.staticflickr.com/${foto.server}/${foto.id}_${foto.secret}_z.jpg`
            );
            this.mostrarFotografias();
        } else {
            console.error("Error en la respuesta JSON de Flickr");
        }
    }

    mostrarFotografias() {
        const main = $("main");
        main.empty();

        const article = $("<article></article>");
        const titulo = $("<h2></h2>").text(`Imágenes del circuito de ${this.busqueda}`);
        const imagen = $("<img>").attr("src", this.fotos[this.actual])
                                 .attr("alt", `Foto ${this.actual + 1} del circuito`);

        article.append(titulo);
        article.append(imagen);
        main.append(article);

        // Cambia cada 3 segundos
        setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    cambiarFotografia() {
        this.actual = (this.actual + 1) % this.fotos.length;
        $("main img").attr("src", this.fotos[this.actual]);
    }
}

// Ejemplo de uso al cargar la página
$(document).ready(function() {
    const carruselMugello = new Carrusel("Circuito de Mugello");
    carruselMugello.getFotografias();
});


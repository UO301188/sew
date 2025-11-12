class Carrusel {
    constructor(busqueda) {
        this.busqueda = busqueda;
        this.actual = 0;
        this.maximo = 5; // cantidad de fotos
        this.fotos = [];
        this.intervalo = null; // para guardar el setInterval
    }

    getFotografias() {
        const url = `https://www.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?&tags=${this.busqueda}`;

        return $.ajax({
            url: url,
            dataType: "jsonp"
        }).then(response => {
            this.fotos = response.items.slice(0, 5).map(item => {
                const urlOriginal = item.media.m;
                const url640 = urlOriginal.replace("_m.jpg", "_z.jpg");
                return {
                    title: item.title,
                    author: item.author,
                    link: item.link,
                    url: url640
                };
            });
        }).catch(error => {
            console.error("Error al obtener imágenes:", error);
        });
    }

    mostrarFotografias() {
        if (this.fotos.length === 0) {
            $("#resultado").html("<p>No hay imágenes para mostrar.</p>");
            return;
        }

        // Crear el artículo
        const articulo = $("<article></article>");
        const encabezado = $(`<h2>Imágenes del ${this.busqueda}</h2>`);

        // Crear la imagen inicial
        const imagen = $("<img>")
            .attr("src", this.fotos[this.actual].url)
            .attr("alt", this.fotos[this.actual].title)
            .attr("id", "carrusel-img"); // id para referenciarla después

        articulo.append(encabezado);
        articulo.append(imagen);

        $("#resultado").html(articulo);

        // Iniciar el cambio de fotos cada 3 segundos
        this.intervalo = setInterval(this.cambiarFotografia.bind(this), 3000);
    }

    cambiarFotografia() {
        // Avanzar al siguiente índice
        this.actual = (this.actual + 1) % this.maximo;

        // Actualizar la imagen en el DOM
        $("#carrusel-img")
            .attr("src", this.fotos[this.actual].url)
            .attr("alt", this.fotos[this.actual].title);
    }
}

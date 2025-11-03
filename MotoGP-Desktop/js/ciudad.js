class Ciudad{
    nombre;
    pais;
    gentilicio;
    cantidadPoblacion;
    coordenadas;

    constructor(nombre, pais, gentilicio){
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
    }

    fillAtributes(){
        this.cantidadPoblacion = 7164;
        this.coordenadas = {
            latitud: 43.9936,
            longitud: 11.3542
        };
    }

    getNombreCiudad(){
        return this.nombre;
    }
    
    getPais(){
        return this.pais;
    }

    getInfoSecundaria() {
        // Devuelve HTML con la información secundaria (no escribe en el documento)
        return `
        <section aria-label="Información secundaria">
            <h3>Información secundaria</h3>
            <ul>
                <li>Gentilicio: ${this.gentilicio}</li>
                <li>Población: ${this.cantidadPoblacion.toLocaleString()}</li>
            </ul>
        </section>
        `;
    }

    getCoordenadasHTML() {
        // Devuelve HTML con las coordenadas (sustituye el anterior document.write)
        return `
        <section aria-label="Coordenadas">
            <p>Coordenadas de ${this.nombre}:</p>
            <ul>
                <li>Latitud: ${this.coordenadas.latitud}</li>
                <li>Longitud: ${this.coordenadas.longitud}</li>
            </ul>
        </section>
        `;
    }
}
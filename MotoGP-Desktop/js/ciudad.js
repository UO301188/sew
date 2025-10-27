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
        return `
        <ul>
            <li><strong>Gentilicio:</strong> ${this.gentilicio}</li>
            <li><strong>Población:</strong> ${this.cantidadPoblacion.toLocaleString()}</li>
        </ul>
        `;
    }

    mostrarCoordenadas() {
        document.write(`
            <p><strong>Coordenadas de ${this.nombre}:</strong></p>
            <ul>
                <li>Latitud: ${this.coordenadas.latitud}</li>
                <li>Longitud: ${this.coordenadas.longitud}</li>
            </ul>
        `);
    }
}
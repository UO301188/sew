<?php

class Clasificacion
{
    /**
     * @var string Ruta de acceso al documento XML.
     */
    private $documento;

    /**
     * Constructor de la clase. Inicializa la ruta del documento XML.
     */
    public function __construct()
    {
        // Inicializa el atributo $documento con la ruta de acceso al archivo.
        $this->documento = 'xml/circuitoEsquema.xml';
    }

    private function consultar()
    {
        if (!file_exists($this->documento)) {
            // Error handling for missing file (sin estilos)
            error_log("ERROR: No se encuentra el archivo XML en la ruta: " . $this->documento);
            echo "<p>ERROR: No se pudo cargar el archivo XML. Verifique la ruta y existencia de: " . htmlspecialchars($this->documento) . "</p>";
            return null;
        }

        try {
            // Lectura del contenido del archivo XML.
            $xml = simplexml_load_file($this->documento);

            if ($xml === false) {
                // Error handling for XML parsing failure (sin estilos)
                error_log("ERROR: Fallo al cargar el archivo XML. simplexml_load_file devolvió false.");
                echo "<p>ERROR: Fallo al parsear el archivo XML. Verifique el formato del documento.</p>";
                return null;
            }

            return $xml;

        } catch (Exception $e) {
            error_log("Excepción al consultar el XML: " . $e->getMessage());
            echo "<p>Excepción al consultar el XML: " . htmlspecialchars($e->getMessage()) . "</p>";
            return null;
        }
    }


    public function mostrarGanadorCarrera()
    {
        $xml = $this->consultar();
        if (!$xml)
            return;

        $vencedor = $xml->vencedor;

        if ($vencedor && $vencedor->nombreVencedor && $vencedor->duracion) {
            $nombre = (string) $vencedor->nombreVencedor;
            $duracion = (string) $vencedor->duracion;
            $nombreCircuito = htmlspecialchars((string) $xml->nombre);
            $duracionFormateada = str_replace(array('PT', 'M', 'S'), array('', ' minutos, ', ' segundos'), $duracion);

            // Se cierra PHP para generar HTML de forma limpia.
            ?>
            <section>
                <h2>Ganador de la Carrera</h2>
                <article>
                    <h3>El Piloto Victorioso</h3>
                    <p>El ganador de la carrera en el circuito <?php echo $nombreCircuito; ?> es:</p>
                    <ul>
                        <li>Piloto: <?php echo htmlspecialchars($nombre); ?></li>
                        <li>Tiempo total: <?php echo htmlspecialchars($duracionFormateada); ?></li>
                    </ul>
                </article>
            </section>
            <?php
            // Se reabre PHP para continuar la ejecución de la clase/función.
        } else {
            echo "<section><h2>Ganador de la Carrera</h2><p>Información del ganador no disponible en el XML o el formato es incorrecto.</p></section>";
        }
    }


    public function mostrarClasificacionMundial()
    {
        $xml = $this->consultar();
        if (!$xml)
            return;

        $clasificacion = $xml->clasificacion;

        if ($clasificacion && $clasificacion->puesto) {
            // Se cierra PHP para generar el HTML de la tabla.
            ?>
            <section>
                <h2>Clasificación Mundial (Puntos)</h2>
                <article>
                    <h3>Tabla de Puntuaciones Globales</h3>

                    <table>
                        <caption>Clasificación de Puntos del Campeonato tras la carrera.</caption>
                        <thead>
                            <tr>
                                <th scope='col'>Puesto</th>
                                <th scope='col'>Piloto</th>
                                <th scope='col'>Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Se utiliza la sintaxis alternativa de bucles para mayor claridad en el HTML.
                            foreach ($clasificacion->puesto as $puesto):
                                $posicion = (string) $puesto['pos'];
                                $piloto = (string) $puesto->piloto;
                                $puntos = (string) $puesto->puntos;
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($posicion); ?></td>
                                    <td><?php echo htmlspecialchars($piloto); ?></td>
                                    <td><?php echo htmlspecialchars($puntos); ?></td>
                                </tr>
                            <?php endforeach; // Cierre del bucle foreach ?>
                        </tbody>
                    </table>
                </article>
            </section>
            <?php
            // Se reabre PHP para continuar la ejecución de la clase/función.
        } else {
            echo "<section><h2>Clasificación Mundial (Puntos)</h2><p>Información de la clasificación del mundial no disponible en el XML.</p></section>";
        }
    }
}

// Se instancia la clase Clasificacion
$miClasificacion = new Clasificacion();
?>
<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- Datos que describen el documento. -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name="author" content="Adrián Pérez Menéndez" />
    <meta name="description"
        content="Documento con la clasificación de la carrera y del mundial, extraída dinámicamente de un archivo XML." />
    <meta name="keywords" content="motogp, clasificacion, php, xml, mundial, ganador" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon-48px.ico" type="image/x-icon" />
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>
            <a href="index.html" title="Ir a la página principal de MotoGP-Desktop">MotoGP Desktop</a>
        </h1>
        <nav>
            <a href="index.html" title="MotoGP">Inicio</a>
            <a href="piloto.html" title="MotoGP-Piloto">Piloto</a>
            <a href="circuito.html" title="MotoGP-Circuito">Circuito</a>
            <a href="meteorologia.html" title="MotoGP-Meteorologia">Meteorologia</a>
            <a href="clasificaciones.php" title="MotoGP-Clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="MotoGP-Juegos">Juegos</a>
            <a href="ayuda.html" title="MotoGP-Ayuda">Ayuda</a>
        </nav>
    </header>

    <p class="migas-navegacion">Estás en: <a href="index.html">Inicio</a> &gt;&gt; <strong>Clasificaciones</strong></p>

    <main>
        <!-- Contenido dinámico generado por PHP -->
        <h1>Resultados y Clasificaciones</h1>

        <?php
        // Llama a los métodos para generar el HTML con los datos
        $miClasificacion->mostrarGanadorCarrera();
        $miClasificacion->mostrarClasificacionMundial();
        ?>

    </main>
    <footer>
        <p>&copy; 2025 MotoGP Desktop | Adrián Pérez Menéndez | Datos dinámicos desde XML.</p>
    </footer>
</body>

</html>
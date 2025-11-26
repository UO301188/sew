<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Cronómetro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Enlace a las hojas de estilo del proyecto -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>
    <!-- Header y Navegación Común -->
    <header>
        <h1>
            <a href="index.html" title="Ir a la página principal de MotoGP-Desktop">
                MotoGP Desktop
            </a>
        </h1>
        <nav>
            <a href="index.html" title="MotoGP">Inicio</a>
            <a href="piloto.html" title="MotoGP-Piloto">Piloto</a>
            <a href="circuito.html" title="MotoGP-Circuito">Circuito</a>
            <a href="meteorologia.html" title="MotoGP-Meteorologia">Meteorología</a>
            <a href="clasificaciones.html" title="MotoGP-Clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="MotoGP-Juegos">Juegos</a>
            <a href="ayuda.html" title="MotoGP-Ayuda">Ayuda</a>
        </nav>
    </header>

    <!-- Migas de navegación -->
    <p>
        Estás en: <a href="index.html">Inicio</a> &gt;&gt; <a href="juegos.html">Juegos</a> &gt;&gt; <strong>Cronómetro
            PHP</strong>
    </p>

    <main>
        <h2>Cronómetro en PHP</h2>

        <?php
        // Iniciamos la sesión para poder guardar el estado del cronómetro entre recargas de página
        session_start();

        /**
         * Definición de la clase Cronometro
         */
        class Cronometro
        {
            // Atributos privados
            private $inicio;
            private $tiempo;

            // Constructor: inicializa el tiempo a 0
            public function __construct()
            {
                $this->tiempo = 0;
            }

            // Tarea 3: Arrancar
            public function arrancar()
            {
                $this->inicio = microtime(true);
            }

            // Tarea 4: Parar
            public function parar()
            {
                if ($this->inicio) {
                    $final = microtime(true);
                    $this->tiempo = $final - $this->inicio;
                }
            }

            // Tarea 5: Mostrar
            public function mostrar()
            {
                // Calculamos minutos, segundos y décimas
                $minutos = floor($this->tiempo / 60);
                $segundos = floor($this->tiempo) % 60;
                // Obtenemos decimales, multiplicamos por 10 y redondeamos
                $decimas = floor(($this->tiempo - floor($this->tiempo)) * 10);

                // Mostramos formateado
                printf("%02d:%02d.%d", $minutos, $segundos, $decimas);
            }
        }

        // LÓGICA DE CONTROL (Manejo de botones y Sesión)
        
        // 1. Recuperar o Crear el objeto Cronometro en la sesión
        if (!isset($_SESSION['crono'])) {
            $_SESSION['crono'] = new Cronometro();
        }
        $miCrono = $_SESSION['crono'];

        // 2. Comprobar qué botón se ha pulsado (usando $_POST)
        if (isset($_POST['arrancar'])) {
            $miCrono->arrancar();
        }

        if (isset($_POST['parar'])) {
            $miCrono->parar();
        }

        // Guardamos el estado actualizado en la sesión
        $_SESSION['crono'] = $miCrono;
        ?>

        <!-- Tarea 6: Botonera e Interfaz -->
        <section>
            <h3>Controles</h3>
            <!-- Zona de Pantalla -->
            <article>
                <?php
                // Si se pulsa mostrar, ejecutamos el método mostrar
                if (isset($_POST['mostrar'])) {
                    $miCrono->mostrar();
                } else {
                    // Valor por defecto visual si no se pide mostrar
                    echo "00:00.0";
                }
                ?>
            </article>

            <!-- Formulario con los botones solicitados -->
            <form action="#" method="post">
                <input type="submit" name="arrancar" value="Arrancar" />
                <input type="submit" name="parar" value="Parar" />
                <input type="submit" name="mostrar" value="Mostrar" />
            </form>
        </section>

    </main>

    <footer>
        <p>&copy; 2025 MotoGP Desktop</p>
    </footer>

</body>

</html>
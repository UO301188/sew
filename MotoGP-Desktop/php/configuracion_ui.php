<?php
// Incluye la clase de configuración
require_once('Configuracion.php');

$mensaje = "";
$config = new Configuracion();

if (isset($_POST['accion'])) {
    // Las operaciones POST (reiniciar, eliminar, crear) se ejecutan aquí
    switch ($_POST['accion']) {
        case 'crear':
            // Intentar crear la DB si no existe (método auxiliar)
            $mensaje = $config->CrearBaseDeDatos();
            break;
        case 'reiniciar':
            // Reiniciar base de datos (TRUNCATE)
            $mensaje = $config->ReiniciarBaseDeDatos();
            break;
        case 'eliminar':
            // Eliminar base de datos (DROP)
            $mensaje = $config->EliminarBaseDeDatos();
            break;
    }
}

if (isset($_GET['accion']) && $_GET['accion'] == 'exportar') {
    // La función ExportarDatosCSV maneja las cabeceras y la descarga
    $config->ExportarDatosCSV();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Configuración de Pruebas de Usabilidad</title>
    <link rel="stylesheet" type="text/css" href="/MotoGP-Desktop/estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="/MotoGP-Desktop/estilo/layout.css" />
</head>

<body>
    <header>
        <h1>Apartado de Configuración de Base de Datos</h1>
    </header>

    <main>
        <?php if (!empty($mensaje)): ?>
            <output><?php echo $mensaje; ?></output>
        <?php endif; ?>

        <section>
            <h2>Gestión de la Base de Datos</h2>

            <form method="POST">
                <p>
                    <button type="submit" name="accion" value="crear"
                        onclick="return confirm('¿Estás seguro de que quieres intentar crear la Base de Datos (solo si no existe)?');">
                        Crear/Revisar DB
                    </button>
                </p>
            </form>

            <form method="POST">
                <p>
                    <button type="submit" name="accion" value="reiniciar"
                        onclick="return confirm('ATENCIÓN: ¿Estás seguro de que quieres REINICIAR la Base de Datos? Todos los datos de pruebas se BORRARÁN.');">
                        Reiniciar Datos
                    </button>
                </p>
            </form>

            <form method="POST">
                <p>
                    <button type="submit" name="accion" value="eliminar"
                        onclick="return confirm('PELIGRO: ¿Estás seguro de que quieres ELIMINAR la Base de Datos completa?');">
                        Eliminar DB
                    </button>
                </p>
            </form>

            <form method="GET">
                <p>
                    <button type="submit" name="accion" value="exportar">
                        Exportar Datos (.csv)
                    </button>
                </p>
            </form>
        </section>

        <nav>
            <a href="../juegos.html">Volver a la Página Principal</a>
        </nav>
    </main>
</body>

</html>
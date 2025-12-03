<?php
require_once("Configuracion.php");

class PruebaUsabilidad extends Configuracion
{
    public function obtenerOpciones($tabla, $id_col, $nombre_col)
    {
        $permitidas = [
            "profesiones" => ["id_profesion", "nombre"],
            "generos" => ["id_genero", "nombre"]
        ];

        if (!isset($permitidas[$tabla]))
            return [];
        if (!in_array($id_col, $permitidas[$tabla]))
            return [];
        if (!in_array($nombre_col, $permitidas[$tabla]))
            return [];

        $stmt = $this->mysqli->prepare("SELECT $id_col,$nombre_col FROM $tabla ORDER BY $nombre_col");
        $stmt->execute();
        $res = $stmt->get_result();

        $arr = [];
        while ($r = $res->fetch_assoc())
            $arr[] = $r;
        return $arr;
    }
}

$prueba_app = new PruebaUsabilidad();
$profesiones = $prueba_app->obtenerOpciones("profesiones", "id_profesion", "nombre");
$generos = $prueba_app->obtenerOpciones("generos", "id_genero", "nombre");
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Prueba de Usabilidad - MotoGP Desktop</title>
    <link rel="stylesheet" type="text/css" href="/MotoGP-Desktop/estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="/MotoGP-Desktop/estilo/layout.css" />
    <script src="/MotoGP-Desktop/js/prueba_usabilidad.js" defer></script>
</head>

<body>
    <header>
        <h1>Prueba de Usabilidad</h1>
    </header>

    <main>
        <section id="inicio-prueba">
            <h2>Bienvenido al Test de Usabilidad</h2>
            <p>Pulse el botón para iniciar el cronómetro y comenzar el test. El tiempo corre desde el inicio hasta el
                botón de "Terminar prueba".</p>

            <button type="button" onclick="iniciarPrueba()">Iniciar Prueba</button>
        </section>

        <article id="formulario-prueba" style="display:none;">
            <h2>Formulario de Usabilidad</h2>
            <form method="POST" action="procesar_prueba.php">

                <input type="hidden" name="tiempo_segundos" id="tiempo_segundos" value="0">

                <section>
                    <h3>Datos del Participante (Obligatorio)</h3>

                    <fieldset>
                        <legend>Identificación y Perfil</legend>

                        <label for="codigo_usuario">Código de Identificación (1-12):</label>
                        <select name="codigo_usuario" id="codigo_usuario" required>
                            <option value="">-- Seleccione Código --</option>
                            <?php for ($i = 1; $i <= 12; $i++): ?>
                                <option value="<?php echo $i; ?>">Usuario <?php echo $i; ?></option>
                            <?php endfor; ?>
                        </select>

                        <label for="profesion">Profesión:</label>
                        <select name="profesion" id="profesion" required>
                            <option value="">-- Seleccione Profesión --</option>
                            <?php foreach ($profesiones as $p): ?>
                                <option value="<?php echo $p['id_profesion']; ?>">
                                    <?php echo htmlspecialchars($p['nombre']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>

                        <label for="edad">Edad:</label>
                        <input type="number" name="edad" id="edad" min="18" max="120" required>

                        <label for="genero">Género:</label>
                        <select name="genero" id="genero" required>
                            <option value="">-- Seleccione Género --</option>
                            <?php foreach ($generos as $g): ?>
                                <option value="<?php echo $g['id_genero']; ?>"><?php echo htmlspecialchars($g['nombre']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>

                        <label>Pericia Informática (0 - 10): <output id="pericia_display">5</output></label>
                        <input type="range" name="pericia" id="pericia" min="0" max="10" step="1" value="5"
                            oninput="document.getElementById('pericia_display').value = this.value">
                    </fieldset>
                </section>

                <section>
                    <h3>Cuestionario de 10 Preguntas</h3>

                    <fieldset>
                        <legend>Respuestas Rápidas</legend>

                        <p>1. ¿Cuál es la **longitud** (en metros) del Circuito Internazionale de Mugello?</p>
                        <input type="number" name="p1" placeholder="Longitud en metros" required>

                        <p>2. ¿Cuál es el **dorsal** que utiliza el piloto Somkiat Chantra?</p>
                        <input type="text" name="p2" placeholder="Número de dorsal" required>

                        <p>3. ¿Cuál es la **latitud** geográfica de la ciudad asociada al circuito (Scarperia)?</p>
                        <input type="number" name="p3" placeholder="Latitud" step="0.0001" required>

                        <p>4. ¿Qué **patrocinador** aparece asociado al circuito?</p>
                        <p>
                            <input type="radio" name="p4" value="Repsol" required><label>Repsol</label>
                            <input type="radio" name="p4" value="Yamaha"><label>Yamaha</label>
                            <input type="radio" name="p4" value="Ducati"><label>Ducati</label>
                        </p>

                        <p>5. ¿Cuál es la nacionalidad del piloto Somkiat Chantra?</p>
                        <p>
                            <input type="radio" name="p5" value="ingles" required><label>ingles</label>
                            <input type="radio" name="p5" value="italiano"><label>italiano</label>
                            <input type="radio" name="p5" value="tailandés"><label>tailandés</label>
                        </p>

                        <p>6. ¿Qué término describe una serie de curvas pronunciadas para reducir la velocidad?</p>
                        <input type="text" name="p6" placeholder="Concepto (ej: Chicane)" required>

                        <p>7. ¿Cómo se llama el equipo para el que corrió Somkiat Chantra de 2019 a 2024?</p>
                        <input type="text" name="p7" placeholder="Nombre del equipo" required>

                        <p>8. ¿Cuántos puntos tiene Francesco Bagnaia?</p>
                        <input type="number" name="p8" placeholder="Puntos" required>

                        <p>9. ¿Qué término se utiliza para una carrera corta que se celebra los sábados?</p>
                        <input type="text" name="p9" placeholder="Nombre de la carrera" required>

                        <p>10. ¿Cuál es el peso (en kilogramos) del piloto Somkiat Chantra?</p>
                        <input type="number" name="p10" placeholder="Peso en kg" required>

                    </fieldset>
                </section>

                <section>
                    <h3>Resultados y Valoración de la Aplicación</h3>

                    <fieldset>
                        <legend>Detalles de la Prueba</legend>

                        <label for="dispositivo">Dispositivo de la Prueba:</label>
                        <select name="dispositivo" id="dispositivo" required>
                            <option value="">-- Seleccione Dispositivo --</option>
                            <option value="ordenador">Ordenador</option>
                            <option value="tableta">Tableta</option>
                            <option value="telefono">Teléfono</option>
                        </select>

                        <label>Estado de la Tarea:</label>
                        <p>
                            <input type="radio" name="completado" id="completado_si" value="1" required>
                            <label for="completado_si">Completada</label>

                            <input type="radio" name="completado" id="completado_no" value="0">
                            <label for="completado_no">Abandonada</label>
                        </p>

                        <label for="comentarios_usuario">Comentarios del Usuario:</label>
                        <textarea name="comentarios_usuario" id="comentarios_usuario" rows="5"></textarea>

                        <label for="propuestas">Propuestas de Mejora:</label>
                        <textarea name="propuestas" id="propuestas" rows="5"></textarea>

                        <label>Valoración de la Aplicación (0 - 10): <output id="valoracion_display">5</output></label>
                        <input type="range" name="valoracion" id="valoracion" min="0" max="10" step="1" value="5"
                            oninput="document.getElementById('valoracion_display').value = this.value">
                    </fieldset>
                </section>

                <section id="observador-section" style="display:none;">
                    <h3>Comentarios del Observador</h3>
                    <fieldset>
                        <legend>Notas del Facilitador (Opcional)</legend>
                        <label for="comentarios_facilitador">Comentarios del Facilitador:</label>
                        <textarea name="comentarios_facilitador" id="comentarios_facilitador" rows="5"></textarea>
                    </fieldset>
                </section>

                <p>
                    <button type="submit" onclick="return terminarPrueba()">Terminar Prueba</button>
                    <button type="reset">Reiniciar Formulario</button>
                </p>
            </form>
        </article>
    </main>

    <footer>
        <p><a href="configuracion_ui.php">Volver a Configuración</a></p>
    </footer>
</body>

</html>
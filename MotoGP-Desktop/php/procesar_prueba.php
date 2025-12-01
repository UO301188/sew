<?php
require_once("Configuracion.php");

class ProcesadorPrueba extends Configuracion
{
    public function procesarFormulario($data)
    {
        if (!isset($data["codigo_usuario"]) || !isset($data["tiempo_segundos"]))
            return "Error: falta código o tiempo.";

        $edad = intval($data["edad"]);
        $pericia = intval($data["pericia"]);
        $prof = intval($data["profesion"]);
        $gen = intval($data["genero"]);

        $this->mysqli->begin_transaction();

        try {
            $stmt_sel = $this->mysqli->prepare("SELECT id_usuario FROM usuarios WHERE codigo_identificacion=?");
            $stmt_sel->bind_param("s", $data["codigo_usuario"]);
            $stmt_sel->execute();
            $res = $stmt_sel->get_result();

            if ($res->num_rows > 0) {
                $row = $res->fetch_assoc();
                $id_usuario = $row["id_usuario"];

                $stmt_up = $this->mysqli->prepare("
                    UPDATE usuarios SET profesion=?,edad=?,genero=?,pericia_informatica=? 
                    WHERE id_usuario=?
                ");
                $stmt_up->bind_param("iiiii", $prof, $edad, $gen, $pericia, $id_usuario);
                $stmt_up->execute();
                $stmt_up->close();

            } else {
                $stmt_in = $this->mysqli->prepare("
                    INSERT INTO usuarios (codigo_identificacion,profesion,edad,genero,pericia_informatica)
                    VALUES (?,?,?,?,?)
                ");
                $stmt_in->bind_param("siiii", $data["codigo_usuario"], $prof, $edad, $gen, $pericia);
                $stmt_in->execute();
                $id_usuario = $this->mysqli->insert_id;
                $stmt_in->close();
            }
            $stmt_sel->close();


            $tiempo_segundos = intval($data["tiempo_segundos"]);
            $completado = intval($data["completado"]);
            $valoracion = intval($data["valoracion"]);
            $fecha_prueba = date("Y-m-d H:i:s");

            $stmt_pr = $this->mysqli->prepare("
                INSERT INTO pruebas_usabilidad 
                (id_usuario,dispositivo,tiempo_segundos,completado,comentarios_usuario,
                 propuestas_mejora,valoracion,fecha_prueba)
                VALUES (?,?,?,?,?,?,?,?)
            ");
            $stmt_pr->bind_param(
                "isiissis",
                $id_usuario,
                $data["dispositivo"],
                $tiempo_segundos,
                $completado,
                $data["comentarios_usuario"],
                $data["propuestas"],
                $valoracion,
                $fecha_prueba
            );
            $stmt_pr->execute();
            $id_prueba = $this->mysqli->insert_id;
            $stmt_pr->close();

            for ($i = 1; $i <= 10; $i++) {
                if (!isset($data["p$i"]))
                    continue;
                $respuesta_pregunta = $data["p$i"];

                $stmt_sus = $this->mysqli->prepare("
                    INSERT INTO respuestas_prueba (id_prueba,pregunta_numero,respuesta_texto)
                    VALUES (?,?,?)
                ");
                $stmt_sus->bind_param("iis", $id_prueba, $i, $respuesta_pregunta);
                $stmt_sus->execute();
                $stmt_sus->close();
            }

            $comentarios_facilitador = trim($data["comentarios_facilitador"]);
            if (!empty($comentarios_facilitador)) {
                $stmt_obs = $this->mysqli->prepare("
                    INSERT INTO observaciones (id_prueba,comentarios_facilitador)
                    VALUES (?,?)
                ");
                $stmt_obs->bind_param("is", $id_prueba, $comentarios_facilitador);
                $stmt_obs->execute();
                $stmt_obs->close();
            }

            $this->mysqli->commit();
            return "Prueba guardada correctamente. ID prueba: $id_prueba";

        } catch (Exception $e) {
            $this->mysqli->rollback();
            return "Error guardando prueba: " . $e->getMessage();
        }
    }
}

$mensaje = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $proc = new ProcesadorPrueba();
    $mensaje = $proc->procesarFormulario($_POST);
}
?>
<!DOCTYPE html>
<html>

<body>
    <h2>Resultado</h2>
    <p><?= $mensaje ?></p>
    <a href="prueba_usabilidad.php">Volver</a>
</body>

</html>
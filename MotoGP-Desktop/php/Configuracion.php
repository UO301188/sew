<?php

class Configuracion
{
    private $host = "localhost";
    private $user = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $dbName = "UO301188_DB";

    protected $mysqli;

    public function __construct()
    {
        $this->mysqli = new mysqli($this->host, $this->user, $this->password);

        if ($this->mysqli->connect_error) {
            die("Error conexión MySQL: " . $this->mysqli->connect_error);
        }

        if (!$this->mysqli->select_db($this->dbName)) {
            $this->CrearBaseDeDatos();
            $this->mysqli->select_db($this->dbName);
        }
    }

    public function CrearBaseDeDatos()
    {
        $sql = file_get_contents("startup.sql");
        $this->mysqli->multi_query($sql);

        while ($this->mysqli->more_results() && $this->mysqli->next_result()) {
        }
        return "Base de datos creada correctamente.";
    }

    public function ReiniciarBaseDeDatos()
    {
        $sql = "
            SET FOREIGN_KEY_CHECKS=0;
            TRUNCATE TABLE observaciones;
            TRUNCATE TABLE respuestas_prueba;
            TRUNCATE TABLE pruebas_usabilidad;
            TRUNCATE TABLE usuarios;
            SET FOREIGN_KEY_CHECKS=1;
        ";
        $this->mysqli->multi_query($sql);
        while ($this->mysqli->more_results() && $this->mysqli->next_result()) {
        }
        return "Base de datos reiniciada.";
    }

    public function EliminarBaseDeDatos()
    {
        if ($this->mysqli->query("DROP DATABASE IF EXISTS " . $this->dbName))
            return "Base de datos eliminada.";

        return "No se pudo eliminar.";
    }

    public function ExportarDatosCSV()
    {
        $stmt = $this->mysqli->prepare("
            SELECT u.codigo_identificacion, p.dispositivo, 
                   p.tiempo_segundos, p.completado, p.valoracion,
                   p.comentarios_usuario, p.propuestas_mejora, p.fecha_prueba
            FROM pruebas_usabilidad p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            ORDER BY p.fecha_prueba DESC
        ");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            echo "No hay datos para exportar.";
            exit;
        }

        header("Content-Type: text/csv; charset=utf-8");
        header("Content-Disposition: attachment; filename=export_" . date("Ymd_His") . ".csv");

        $out = fopen("php://output", "w");
        fputcsv($out, [
            "Código",
            "Dispositivo",
            "Tiempo",
            "Completado",
            "Valoración",
            "Comentarios",
            "Mejoras",
            "Fecha"
        ], ';');

        while ($row = $result->fetch_assoc()) {
            fputcsv($out, $row, ';');
        }
        fclose($out);
        exit;
    }

    public function __destruct()
    {
        if ($this->mysqli)
            $this->mysqli->close();
    }
}
?>
<?php
/**
 * Clase Cronometro
 * Implementa el control de tiempo utilizando el paradigma de Orientación a Objetos en PHP.
 * NO utiliza sesiones, se asume que esta lógica es manejada por el JS del cliente
 * o que el tiempo se controla en el lado del cliente (para la versión de usabilidad,
 * el tiempo final se envía directamente con el formulario).
 *
 * NOTA: Esta clase es una reimplementación más sencilla para mostrar la estructura OOP
 * sin depender del cronómetro basado en sesiones que vimos antes.
 * Para la prueba de usabilidad, el tiempo lo reportará el cliente.
 */
class Cronometro
{
    private $inicio;
    private $fin;
    private $parado;

    public function __construct()
    {
        // Inicialización de propiedades
        $this->inicio = null;
        $this->fin = null;
        $this->parado = true;
    }

    /**
     * Arranca el cronómetro.
     */
    public function arrancar()
    {
        if ($this->parado) {
            $this->inicio = microtime(true);
            $this->fin = null;
            $this->parado = false;
        }
    }

    /**
     * Detiene el cronómetro.
     */
    public function parar()
    {
        if (!$this->parado) {
            $this->fin = microtime(true);
            $this->parado = true;
        }
    }

    /**
     * Devuelve el tiempo transcurrido en segundos como entero.
     * @return int Tiempo transcurrido en segundos (redondeado).
     */
    public function getTiempoSegundos()
    {
        if (is_null($this->inicio)) {
            return 0; // No se ha iniciado
        }

        $tiempo_actual = $this->parado ? $this->fin : microtime(true);

        // Retorna el tiempo en segundos redondeado al entero más cercano
        return (int) round($tiempo_actual - $this->inicio);
    }

    /**
     * Formatea el tiempo transcurrido en minutos:segundos.décima.
     * @return string Tiempo formateado.
     */
    public function mostrar()
    {
        if (is_null($this->inicio)) {
            return "00:00.0";
        }

        $tiempo_total = $this->parado ? ($this->fin - $this->inicio) : (microtime(true) - $this->inicio);

        $minutos = floor($tiempo_total / 60);
        $segundos = floor($tiempo_total - ($minutos * 60));
        $decimas = floor(($tiempo_total - floor($tiempo_total)) * 10);

        return sprintf("%02d:%02d.%d", $minutos, $segundos, $decimas);
    }
}
?>
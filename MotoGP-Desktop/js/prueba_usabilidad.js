// js/prueba_usabilidad.js

/**
 * Variable global para almacenar el momento de inicio de la prueba (en milisegundos).
 * Es un contador no visible para el usuario.
 */
let tiempoInicio = 0;

/**
 * Se ejecuta al hacer clic en "Iniciar Prueba".
 * 1. Oculta el mensaje de bienvenida.
 * 2. Muestra el formulario de prueba.
 * 3. Registra el tiempo de inicio (timestamp).
 */
function iniciarPrueba() {
    // 1. Ocultar la sección de bienvenida
    const inicio = document.getElementById('inicio-prueba');
    if (inicio) {
        inicio.style.display = 'none';
    }

    // 2. Mostrar el formulario
    const formulario = document.getElementById('formulario-prueba');
    if (formulario) {
        formulario.style.display = 'block';
    }

    // 3. Registrar el tiempo de inicio
    tiempoInicio = Date.now(); 
    
    // (Opcional: solo para depuración en la consola del desarrollador)
    console.log("Prueba iniciada. Tiempo de inicio (ms):", tiempoInicio);
}

/**
 * Se ejecuta al hacer clic en "Terminar Prueba" (antes de que se envíe el formulario).
 * 1. Calcula el tiempo total transcurrido.
 * 2. Asigna ese valor al campo oculto del formulario.
 * @returns {boolean} Devuelve 'true' para permitir el envío del formulario.
 */
function terminarPrueba() {
    const campoTiempo = document.getElementById('tiempo_segundos');

    // 1. Verificación: Asegurar que la prueba se inició
    if (tiempoInicio === 0) {
        alert("¡Advertencia! Debe pulsar 'Iniciar Prueba' antes de terminar.");
        return false; // Evita el envío del formulario
    }
    
    // 2. Calcular el tiempo total transcurrido en segundos (redondeado hacia abajo)
    const tiempoFinalSegundos = Math.floor((Date.now() - tiempoInicio) / 1000);

    // 3. Asignar el tiempo calculado al campo oculto
    if (campoTiempo) {
        campoTiempo.value = tiempoFinalSegundos;
    }

    // (Opcional: solo para depuración en la consola del desarrollador)
    console.log("Tiempo registrado en segundos:", tiempoFinalSegundos);

    // 4. Permitir que el formulario se envíe a procesar_prueba.php
    return true; 
}
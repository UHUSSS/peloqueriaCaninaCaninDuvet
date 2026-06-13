# Documento de Requerimientos y Prompt - Sistema de Peluquería Canina

Este documento contiene las características extraídas del video de TikTok del sistema de gestión de estética animal y un "prompt" listo para ser utilizado en la generación del software.

## Características y Módulos Extraídos del Sistema

En el análisis del video, pudimos observar que se trata de un sistema de gestión empresarial (CRM) específico para peluquerías caninas, que se opera desde un ordenador, probablemente como aplicación de escritorio, de fácil lectura con esquema de un pago único. 

### 1. Base de Datos de Clientes y Mascotas
Se observa que la ficha del sistema vincula al dueño con su mascota mediante un perfil que contiene:
* **Datos Básicos del Propietario:** Nombre.
* **Datos Generales de la Mascota:** Nombre, Especie (perro, gato), Raza.
* **Características Físicas:** Peso (kg), Color, Tamaño (Dropdown/Selector de tamaño) y Género.
* **Información Relevante:** Edad y Comportamiento.
* **Alertas:** Notas críticas como "Notas especiales/alergias", vitales para evitar accidentes.

### 2. Módulo de Registro de Servicios
Se encarga de planificar, ejecutar y cobrar los trabajos en curso:
* **Personal:** Seleccionador de Estilista/Peluquero que procesará el servicio.
* **Descripción de Tareas:** Área de texto grande para detailing de lo realizado (ej: Baño, hidratación, corte específico).
* **Agendamiento:** Selección de la fecha y hora de la cita.
* **Módulo de Pago:** Precio cobrado por el servicio.
* **Galería Comparativa:** Herramienta estelar que permite cargar fotos de la sesión ("Antes" y "Después").

### 3. Histórico y Tablero de Control (Dashboard)
* **Vista General (Dashboard):** Lista los servicios del día con su estado, representado por "Badges" de colores para saber al instante si un turno está "Pendiente" o "Completado".
* **Historial por Mascota:** Permite tener todo el rastro de visitas de un perrito durante un tiempo.

---

## Prompt de Creación del Sistema

A continuación, puedes utilizar el siguiente texto (prompt) directamente para pedirme (o a otra IA) que comience a estructurar el código paso a paso:

```text
Actúa como un Arquitecto Full Stack e Ingeniero de Software UI/UX especializado en interfaces minimalistas. 
Deseo desarrollar un sistema de gestión (CRM) para un salón de Peluquería Canina que opere visualmente con ventanas modales (pop-ups) limpias para una entrada de datos rápida sin recargar la página.

El sistema debe tener los siguientes módulos:

1. Módulo de Gestión de Mascotas y Clientes: Debe contener un formulario donde vincule al propietario (Nombre) con la mascota (Nombre, Especie, Raza, Peso en Kg, Color, Tamaño, Género, Edad y Comportamiento). Debe existir un área prioritaria (visible y notoria) de "Alertas/Alergias" para la mascota.

2. Módulo de Servicios y Citas: Un formulario de trabajo que asocie el paciente registrado con el "Estilista" a cargo. Deberá llevar: Fecha y Hora de atención, recuadro de texto de descripción detallada del procedimiento y valor del precio cobrado. Muy Importante: Permitir adjuntar 2 imágenes que funjan como "Antes" y "Después".

3. Dashboard y Panel de Control Principal: Una tabla moderna en la vista principal donde se detallen las citas del día y posea insignias (badges) de color indicando el estado del servicio en tiempo real (Ej. 'Pendiente', 'Terminado').

4. Historial Médico-Estético: Al pinchar sobre una mascota, se debe desplegar una línea de tiempo cronológica con los últimos servicios que ha tomado.

Quiero utilizar un stack de tecnologías moderno que corra como una Web PWA pero que luzca como Desktop, preferiblemente React (Next.js/Vite) para el Frontend con TailwindCSS. Por favor, devuélveme la estructura de la base de datos necesaria, y la página principal (dashboard) para empezar.
```

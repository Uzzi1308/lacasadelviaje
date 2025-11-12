# README - Landing Page Barrancas del Cobre

## Descripción
Landing page para promoción de tours a las Barrancas del Cobre. Incluye formularios de reserva, carrusel de itinerario, información de precios y testimonios de clientes.


## Configuración Antes de Subir

### 1. Configurar Email de Destino
Editar `form.php` línea 4:
```php
$emailDestino = 'info@lacasadelviaje.com';
```

### 2. Verificar Modo Debug
Asegurarse que ambos estén en `false`:

form.php línea 10:
```php
$debug = false;
```

form-handler.js línea 215:
```javascript
const DEBUG = false;
```

### 3. Verificar Servidor de Email
Probar que el servidor pueda enviar emails con la función mail() de PHP o configurar SMTP alternativo.

## Pruebas Recomendadas

1. Enviar formulario desde sección Hero
2. Enviar formulario desde modal flotante
3. Verificar recepción de email con formato correcto
4. Probar en dispositivos móviles
5. Verificar funcionamiento de carruseles (itinerario y testimonios)
## Características Principales

- Formulario de reserva dual (hero + modal flotante)
- Carrusel de itinerario de 5 días
- Mapa interactivo de recorrido
- Sección de precios con 5 categorías
- Carrusel de testimonios de clientes
- Diseño responsive (móvil, tablet, desktop)
- Validación de formularios cliente y servidor
- Sistema de notificaciones de envío
- Protección anti-spam con honeypot
- Animaciones de scroll y hover
- Botón scroll to top

## Dependencias Externas (CDN)

- Swiper.js 11.0.5 (carruseles)
- Font Awesome 6.4.0 (iconos)

## Resolución de Problemas

### Los emails no llegan
- Verificar configuración SMTP del servidor
- Revisar carpeta de spam
- Comprobar que form.php tenga permisos correctos
- Activar $debug = true temporalmente para ver errores

### Formulario no envía
- Revisar consola del navegador
- Verificar que form.php sea accesible
- Comprobar validación JavaScript

## Contacto

Para soporte técnico o consultas:
uzielgomezbrian@gmail.com

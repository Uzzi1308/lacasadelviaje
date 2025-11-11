#  Landing Page - Barrancas del Cobre

Landing page promocional para el tour "Barrancas del Cobre" de **La Casa del Viaje**. Página responsive con carruseles interactivos, formularios de contacto.

---

##  Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Instalación en WordPress](#-instalación-en-wordpress)
- [Integración con Contact Form 7](#-integración-con-contact-form-7)
- [Configuración](#-configuración)
- [Secciones de la Página](#-secciones-de-la-página)
- [Personalización](#-personalización)
- [Optimización y Performance](#-optimización-y-performance)
- [Soporte de Navegadores](#-soporte-de-navegadores)
- [Créditos](#-créditos)

---

##  Características

-  **Diseño  Responsive** - Optimizado para móvil, tablet y desktop
-  **Carruseles Interactivos** - Itinerario y reseñas con Swiper.js
-  **Modal de Reserva** - Formulario flotante con animaciones suaves
-  **Integración Contact Form 7** - Compatible con WordPress
-  **Optimización SEO** - Meta tags, preload y lazy loading
-  **Performance** - CSS y JS optimizados, imágenes lazy load
-  **Accesibilidad** - ARIA labels y navegación por teclado
---

##  Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| HTML5 | - | Estructura semántica |
| CSS3 | - | Estilos y animaciones |
| JavaScript (Vanilla) | ES6+ | Funcionalidades |
| Swiper.js | 11.0.5 | Carruseles |
| Font Awesome | 6.4.0 | Iconografía |
| Contact Form 7 | - | Formularios (WordPress) |

### CDN Utilizados
```html
<!-- Swiper -->
https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css
https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js

<!-- Font Awesome -->
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
```

---

##  Instalación en WordPress

### Opción 1: Página Personalizada (Recomendada)

1. **Crear una Plantilla de Página**
   ```php
   // En tu tema: wp-content/themes/tu-tema/template-barrancas.php
   <?php
   /*
   Template Name: Barrancas del Cobre
   */
   ?>
   <!DOCTYPE html>
   <html lang="es">
   <!-- Pega aquí el contenido de index.html -->
   </html>
   ```

2. **Subir Archivos CSS y JS**
   - Carpeta CSS: `wp-content/themes/tu-tema/css/`
   - Carpeta JS: `wp-content/themes/tu-tema/js/`

3. **Crear Nueva Página en WordPress**
   - Páginas → Añadir nueva
   - Título: "Barrancas del Cobre"
   - Plantilla: Seleccionar "Barrancas del Cobre"
   - Publicar

### Opción 2: Plugin HTML personalizado

1. Instalar plugin "Insert HTML Snippet" o similar
2. Crear nuevo snippet con el contenido HTML
3. Insertar shortcode en una página

### Opción 3: Página estática externa

1. Subir archivos vía FTP a carpeta `/landing/barrancas/`
2. Acceder mediante: `tudominio.com/landing/barrancas/`

---

## 📧 Integración con Contact Form 7


###  Reemplazar en HTML

**En index.html, línea ~73 (Hero Section):**
```html
<!-- ANTES (comentar) -->
<!--
<form id="bookingForm">
  ...
</form>
-->

<!-- DESPUÉS -->
[contact-form-7 id="78854f1" title="Home-Barrancas-del-cobre"]
```

**En index.html, línea ~641 (Modal):**
```html
<!-- ANTES (comentar) -->
<!--
<form id="modalBookingForm">
  ...
</form>
-->

<!-- DESPUÉS -->
[contact-form-7 id="888bb7a" title="Modal-Barrancas-del-cobre"]
```


##  Configuración

### Ajustes Globales (config-global.js)

```javascript
const CONFIG = {
  autoplay: {
    disableOnInteraction: false,  // Continuar autoplay después de interacción
    pauseOnMouseEnter: true       // Pausar al pasar el mouse
  },
  
  scroll: {
    navbarThreshold: 100,         // Píxeles para contraer navbar
    scrollToTopThreshold: 300     // Píxeles para mostrar botón "ir arriba"
  },
  
  animations: {
    threshold: 0.2,               // % visible para activar animación
    rootMargin: '0px 0px -100px 0px'
  }
};
```

### Personalizar Velocidades de Carruseles

**En main.js, línea ~14 (Itinerario):**
```javascript
autoplay: { 
  delay: 4000,  // Cambiar velocidad (milisegundos)
  ...CONFIG.autoplay 
}
```

**En main.js, línea ~39 (Reseñas):**
```javascript
autoplay: { 
  delay: 3500,  // Cambiar velocidad (milisegundos)
  ...CONFIG.autoplay 
}
```

---

##  Secciones de la Página

| Sección | Descripción | ID/Clase |
|---------|-------------|----------|
| **Navegación** | Menú fijo con logo | `<nav>` |
| **Hero** | Título + Formulario de reserva | `.hero` |
| **Experiencia** | Descripción de la empresa | `.experience-section` |
| **Itinerario** | Carrusel de 5 días | `#itinerario` |
| **Mapa de Ruta** | Timeline interactivo | `.map-section` |
| **Tips** | Consejos de viaje | `.featured-destinations` |
| **Precios** | Tarjetas de precios | `.precios` |
| **Incluye** | Detalles del tour | `.incluye` |
| **No Incluye** | Exclusiones | `.no-incluye` |
| **Otros Destinos** | Tours relacionados | `#destinos` |
| **Reseñas** | Testimonios de clientes | `#testimonios` |
| **Footer** | Enlaces y logos | `.footer` |

---

##  Personalización

### Cambiar Colores

**En style.css (líneas 1-11):**
```css
:root {
  --primary: #CD1915;        /* Color principal (rojo) */
  --secundary: #9e1311;      /* Color secundario */
  --bg-light: #f8f9fa;       /* Fondo claro */
  --text-dark: #333;         /* Texto oscuro */
  --text-light: #666;        /* Texto claro */
  --radius: 15px;            /* Radio de bordes */
  --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 15px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.4);
}
```
## Optimización y Performance

### Implementado:
-  Lazy loading en imágenes (`loading="lazy"`)
-  Preconnect a CDNs externos
-  Preload de CSS crítico
-  Defer en scripts no críticos
-  Intersection Observer (animaciones eficientes)
-  CSS minimizado (sin comentarios en producción)
-  Imágenes optimizadas (WebP recomendado)

### Mejoras Adicionales (Opcionales):

1. **Minificar CSS y JS**
   - Usar herramientas: CSS Minifier, UglifyJS
   - O plugins de WordPress: Autoptimize, WP Rocket

2. **Caché de WordPress**
   - Instalar: WP Super Cache o W3 Total Cache


---


##  Licencia

Este proyecto es propiedad de **La Casa del Viaje**. Uso interno y comercial exclusivo.

---

##  Contacto

- uzielgomezbrian@gmail.com

---


*Última actualización: 11 de noviembre de 2025*

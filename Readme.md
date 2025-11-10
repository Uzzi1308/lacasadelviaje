# Landing Page-Barrancas del Cobre

## Descripción General

Landing page promocional para el tour "Barrancas del Cobre" de La Casa del Viaje. Desarrollada con HTML, CSS y JavaScript vanilla, bibliotecas como Swiper, font awesome .


## Estructura de Archivos

proyecto/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config-global.js
│   ├── form.js
│   └── main.js
├── img/
│   ├── hero.png
│   ├── experience.png
│   ├── day1.png - day5.png
│   ├── line-chihuahua.png
│   ├── line-creel.png
│   ├── line-divisadero.png
│   ├── line-fuerte.png
│   ├── tip-frio.png
│   ├── tip-calor.png
│   └── tip-comida.png
└── favicon/
    ├── favicon.ico
    ├── favicon.svg
    ├── apple-touch-icon.png
    └── site.webmanifest


## Optimización de Imágenes

### Imágenes Locales para Optimizar

Actualmente las imágenes se sirven localmente. Para optimizar el rendimiento:

**Subir a CDN o servidor optimizado:**
- Comprimir todas las imágenes antes de subirlas
- Usar formatos WebP para mejor compresión
- Mantener versiones JPG/PNG como fallback
- Editar la direccion de las imagenes enn html

**Rutas a actualizar en el HTML:**
- Hero: `img/hero.png` → URL optimizada
- Experiencia: `img/experience.png` → URL optimizada
- Días del itinerario: `img/day1.png` a `img/day5.png`
- Mapas: `img/line-*.png`
- Tips: `img/tip-*.png`

**Configuración recomendada:**
- Tamaño máximo: 1920px de ancho para imágenes grandes
- Calidad: 80-85% para balance calidad/tamaño
- Lazy loading ya implementado en el código



## Configuración del Formulario

### Modos de Operación

El formulario soporta 4 modos de envío, configurable en `config-global.js`:

```javascript
// config-global.js - Sección FORM_CONFIG
modo: 'simulacion' // Opciones: 'simulacion' | 'email' | 'api' | 'google-sheets'
```

#### 1. Modo Simulación (Por defecto)
- Para pruebas y desarrollo
- No envía datos reales
- Muestra confirmación visual
- Ideal para staging

#### 2. Modo Email
- Envía datos a endpoint de correo
- Configurar `endpoints.email` en FORM_CONFIG
- Requiere backend para procesar el envío

#### 3. Modo API
- Envía datos a API REST
- Configurar `endpoints.api` en FORM_CONFIG
- Incluye mapeo de campos automático

#### 4. Modo Google Sheets
- Guarda datos en Google Sheets via Apps Script
- Configurar `endpoints.googleSheets`
- Requiere script de Google configurado

### Campos del Formulario

- Nombre completo (requerido, mínimo 2 caracteres)
- Email (requerido, validación de formato)
- Teléfono (requerido, formateo automático)
- Número de viajeros (select con opciones)

### Validaciones

- Validación en tiempo real de email
- Formateo automático de teléfono: (123) 456-7890
- Validación de longitud mínima en nombre
- Mensajes de error específicos

---

## Instrucciones de Despliegue

### 1. Preparación de Imágenes

```bash
# Comprimir imágenes locales antes de subir
# Usar herramientas como:
- ImageOptim (Mac)
- Squoosh.app (Web)
- Photoshop "Exportar para web"
```

### 2. Configuración de Rutas

Actualizar todas las rutas de imágenes en `index.html`:

```html
<!-- Cambiar de -->
<img src="img/hero.png" alt="...">

<!-- A -->
<img src="https://tudominio.com/img/hero-optimizado.jpg" alt="...">
```

### 3. Configuración del Formulario

1. Editar `js/config-global.js`
2. Seleccionar modo de operación
3. Configurar endpoints según el modo elegido
4. Actualizar field mapping si es necesario

### 4. Verificación Pre-Despliegue

- [ ] Todas las imágenes optimizadas y en CDN
- [ ] Rutas de imágenes actualizadas
- [ ] Formulario configurado correctamente
- [ ] Favicons implementados
- [ ] Meta tags actualizados
- [ ] Pruebas en dispositivos móviles

---

## Configuración Técnica

### Variables CSS Principales

```css
:root {
  --primary: #CD1915;      /* Color principal */
  --secundary: #9e1311;    /* Color secundario */
  --bg-light: #f8f9fa;     /* Fondo claro */
  --text-dark: #333;       /* Texto oscuro */
}
```

### Breakpoints Responsive

- **Móvil:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+

### Dependencias Externas

- Swiper JS 11.0.5 (carruseles)
- Font Awesome 6.4.0 (iconos)
- Google Fonts (tipografía)

---

## Performance y SEO

### Implementado

- Lazy loading en imágenes
- Preconnect para recursos externos
- Meta description optimizada
- Favicons múltiples formatos
- Imágenes con dimensiones explícitas
- Estructura semántica HTML
---

## Soporte y Mantenimiento

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Solución de Problemas Comunes

### Formulario No Envía

1. Verificar modo en FORM_CONFIG
2. Revisar consola del navegador
3. Validar endpoints configurados

### Imágenes No Cargan

1. Verificar rutas actualizadas
2. Confirmar que imágenes existen en servidor
3. Revisar permisos de archivos
4. Verificar formato y tamaño
---

## Licencia

Proyecto desarrollado para La Casa del Viaje. 

##contacto-desarrollador
uzielgomezbrian@gmail.com

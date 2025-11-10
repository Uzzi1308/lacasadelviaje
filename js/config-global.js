
// CONFIGURACIÓN GLOBAL DE LA PAGINA


const CONFIG = {
  // Configuración de carruseles (Swiper)
  autoplay: {
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  
  breakpoints: {
    itinerary: {
      320: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 1.2, spaceBetween: 30 },
      1024: { slidesPerView: 1.3, spaceBetween: 40 }
    },
    reviews: {
      320: { slidesPerView: 1, spaceBetween: 20 },
      640: { slidesPerView: 1.5 },
      1024: { slidesPerView: 2.2 }
    }
  },
  
  // Configuración de animaciones
  animations: {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  },
  
  // Configuración de scroll
  scroll: {
    navbarThreshold: 100,
    scrollToTopThreshold: 300
  }
};


// CONFIGURACIÓN DE FORMULARIOS


const FORM_CONFIG = {
  // MODO DE OPERACIÓN
  // Opciones: 'simulacion' | 'email' | 'api' | 'google-sheets'
  modo: 'simulacion',
  
  // ENDPOINTS (URLs de destino) modificar segun como se administre el formulario
  endpoints: {
    api: 'https://tu-api.com/reservas',
    email: 'https://tu-servidor.com/enviar-email',
    googleSheets: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec'
  },
  
  // MAPEO DE CAMPOS
  // Personaliza los nombres de los campos según tu sistema de administracion
  fieldMapping: {
    nombre: 'name',
    email: 'email', 
    telefono: 'phone',
    viajeros: 'travelers',
    fecha: 'date',
    mensaje: 'message'
  },
  
  // CONFIGURACIÓN ADICIONAL
  settings: {
    debug: false,              // Mostrar logs en consola para pruebas
    timeoutSuccess: 10000,    // Tiempo antes de resetear formulario (ms)
    timeoutError: 500         // Tiempo antes de mostrar error (ms)
  }
};

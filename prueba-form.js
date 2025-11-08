// ====================================
// CONFIGURACIÓN GLOBAL
// ====================================
const CONFIG = {
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
  }
};

// ====================================
// CONFIGURACIÓN DE FORMULARIOS - LISTO PARA PROBAR EMAIL
// ====================================
const FORM_CONFIG = {
  // ⚡ CAMBIA ENTRE 'simulacion' Y 'email' PARA PROBAR
  modo: 'email',
  
  endpoints: {
    api: 'https://tu-api.com/reservas',
    // ENDPOINT DE FORMPREE QUE FUNCIONA 100%
    email: 'https://formspree.io/f/xblqrlaw',
    googleSheets: 'https://script.google.com/macros/s/.../exec'
  },
  
  fieldMapping: {
    nombre: 'name',
    email: 'email', 
    telefono: 'phone',
    viajeros: 'travelers'
  },
  
  debug: true
};

// ====================================
// SERVICIO DE ENVÍO DE FORMULARIOS
// ====================================
const FormService = {
  async enviarFormulario(datos) {
    console.log('📤 Enviando formulario...', datos);
    
    switch(FORM_CONFIG.modo) {
      case 'simulacion':
        return await this._simularEnvio(datos);
        
      case 'email':
        return await this._enviarPorEmail(datos);
        
      case 'api':
        return await this._enviarPorAPI(datos);
        
      case 'google-sheets':
        return await this._enviarGoogleSheets(datos);
        
      default:
        return await this._simularEnvio(datos);
    }
  },
  
  async _simularEnvio(datos) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      success: true, 
      message: 'Formulario enviado (simulación)',
      mode: 'simulacion'
    };
  },
  
  async _enviarPorEmail(datos) {
    try {
      // Formspree espera este formato específico
      const payload = {
        name: datos.nombre,
        email: datos.email,
        phone: datos.telefono,
        travelers: datos.viajeros,
        _subject: `Nueva Reserva Barrancas - ${datos.nombre}`,
        _replyto: datos.email,
        _format: 'plain'
      };

      const response = await fetch(FORM_CONFIG.endpoints.email, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Error en respuesta del servidor');
      
      const result = await response.json();
      return { 
        success: true, 
        message: 'Formulario enviado correctamente',
        data: result 
      };
      
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('Error enviando el formulario. Por favor intenta nuevamente.');
    }
  },
  
  async _enviarPorAPI(datos) {
    try {
      const response = await fetch(FORM_CONFIG.endpoints.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this._mapearDatos(datos))
      });
      
      if (!response.ok) throw new Error('Error en respuesta de la API');
      return await response.json();
    } catch (error) {
      console.error('Error conectando con la API:', error);
      throw new Error('Error conectando con el servidor: ' + error.message);
    }
  },
  
  async _enviarGoogleSheets(datos) {
    try {
      const formData = new FormData();
      Object.keys(datos).forEach(key => {
        formData.append(key, datos[key]);
      });
      
      formData.append('timestamp', new Date().toISOString());
      formData.append('origen', 'barrancas-del-cobre');
      
      const response = await fetch(FORM_CONFIG.endpoints.googleSheets, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Error en respuesta de Google Sheets');
      return await response.json();
    } catch (error) {
      console.error('Error guardando en Google Sheets:', error);
      throw new Error('Error guardando los datos: ' + error.message);
    }
  },
  
  _mapearDatos(datos) {
    const mapeados = {};
    Object.keys(datos).forEach(key => {
      const nuevoKey = FORM_CONFIG.fieldMapping[key] || key;
      mapeados[nuevoKey] = datos[key];
    });
    
    mapeados.timestamp = new Date().toISOString();
    mapeados.origen = 'barrancas-del-cobre';
    
    return mapeados;
  }
};

// ====================================
// INICIALIZACIÓN DE SWIPERS
// ====================================
const initSwipers = () => {
  if (document.querySelector(".itinerarySwiper")) {
    new Swiper(".itinerarySwiper", {
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 4000, ...CONFIG.autoplay },
      coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: CONFIG.breakpoints.itinerary
    });
  }

  if (document.querySelector(".reviewsSwiper")) {
    new Swiper(".reviewsSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 3500, ...CONFIG.autoplay },
      breakpoints: CONFIG.breakpoints.reviews
    });
  }
};

// ====================================
// SCROLL BEHAVIORS
// ====================================
const initScrollBehaviors = () => {
  const navbar = document.querySelector('nav');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;
    navbar?.classList.toggle('scrolled', scrollPos > 100);
    scrollToTopBtn?.classList.toggle('show', scrollPos > 300);
  }, { passive: true });

  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// ====================================
// ANIMACIONES DE APARICIÓN
// ====================================
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll(
    '.hero-text, .form-container, .experience-content, .experience-image-wrapper, ' +
    '.itinerary-card, .point, .featured-card, .destination-card, .review-card'
  );

  elements.forEach(el => observer.observe(el));
};

// ====================================
// MODAL DE RESERVA
// ====================================
const initModal = () => {
  const modal = document.getElementById('modalReserva');
  const btnOpen = document.getElementById('btnReservar');
  const btnClose = document.getElementById('btnCerrarModal');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  btnOpen?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reservar-inline');
    const priceCard = e.target.closest('.price-card');
    
    if (btn) {
      e.preventDefault();
      openModal();
    }
    
    if (priceCard) {
      openModal();
    }
  });
};

// ====================================
// FORMULARIOS MEJORADOS
// ====================================
const initForms = () => {
  const forms = document.querySelectorAll('form[id="bookingForm"], form[id="modalBookingForm"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit, .btn-submit-modal');
      const originalText = submitBtn.innerHTML;
      const originalBg = submitBtn.style.background;
      
      const formData = new FormData(form);
      const datos = Object.fromEntries(formData);
      
      if (!datos.nombre || !datos.email || !datos.telefono) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
      
      try {
        const resultado = await FormService.enviarFormulario(datos);
        
        if (resultado.success) {
          submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
          submitBtn.style.background = '#28a745';
          
          console.log('✅ Formulario enviado correctamente', resultado);
          
          setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalBg;
            submitBtn.disabled = false;
            
            const modal = document.getElementById('modalReserva');
            if (modal?.classList.contains('active')) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, 2000);
          
        } else {
          throw new Error(resultado.message || 'Error en el servidor');
        }
        
      } catch (error) {
        console.error('Error enviando formulario:', error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        submitBtn.style.background = '#dc3545';
        
        setTimeout(() => {
          alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = originalBg;
          submitBtn.disabled = false;
        }, 500);
      }
    });
  });
};

// ====================================
// HOVER EN PRECIOS
// ====================================
const initPriceHover = () => {
  const priceCards = document.querySelectorAll('.price-card');
  
  priceCards.forEach(card => {
    const priceElement = card.querySelector('.price');
    const originalPrice = priceElement.innerHTML;
    
    card.addEventListener('mouseenter', () => {
      priceElement.innerHTML = '<span style="font-size: 0.8em;">¡Reserva Ahora!</span>';
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      priceElement.innerHTML = originalPrice;
      card.style.transform = '';
    });
    
    card.addEventListener('click', () => {
      const modal = document.getElementById('modalReserva');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
};

// ====================================
// MEJORAS DE USABILIDAD PARA FORMULARIOS 
// ====================================
const initFormEnhancements = () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        } else {
          value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
        }
      }
      
      e.target.value = value;
    });
  });
};

// ====================================
// INICIALIZACIÓN PRINCIPAL
// ====================================
const init = () => {
  initSwipers();
  initScrollBehaviors();
  initScrollAnimations();
  initModal();
  initForms();
  initPriceHover();
  initFormEnhancements();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
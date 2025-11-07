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
// INICIALIZACIÓN DE SWIPERS
// ====================================
const initSwipers = () => {
  // Itinerary Swiper
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

  // Reviews Swiper
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

  // Navbar contraído y Scroll to Top
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;

    // Navbar
    navbar?.classList.toggle('scrolled', scrollPos > 100);

    // Scroll to Top Button
    scrollToTopBtn?.classList.toggle('show', scrollPos > 300);
  }, { passive: true });

  // Scroll to top action
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

  // Observar elementos
  const elements = document.querySelectorAll(
    '.hero-text, .form-container, .experience-content, .experience-image-wrapper, ' +
    '.itinerary-card, .point, .featured-card, .destination-card, .review-card'
  );

  elements.forEach(el => observer.observe(el));
};

// ====================================
// MODAL DE RESERVA (MANTENIDO)
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

  // Event listeners
  btnOpen?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);

  // Cerrar con click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Botones inline y tarjetas de precio
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
// FORMULARIOS SIMPLIFICADOS (SOLO UI)
// ====================================
const initForms = () => {
  const forms = document.querySelectorAll('form[id="bookingForm"], form[id="modalBookingForm"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Solo muestra un mensaje en consola, sin enviar datos
      console.log('Formulario enviado (simulación)');
      
      const submitBtn = form.querySelector('.btn-submit, .btn-submit-modal');
      const originalText = submitBtn.innerHTML;
      
      // Simular envío
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
        submitBtn.style.background = '#28a745';
        
        // Resetear después de 2 segundos
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          
          // Cerrar modal si está abierto
          const modal = document.getElementById('modalReserva');
          if (modal?.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 2000);
      }, 1500);
    });
  });
};

// ====================================
// HOVER EN PRECIOS (MANTENIDO)
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
    
    // Click para abrir modal
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
  // Formateo automático de teléfono
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

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
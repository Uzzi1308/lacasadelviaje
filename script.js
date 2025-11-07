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

  // Reviews Swiper
  new Swiper(".reviewsSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    allowTouchMove: false,
    autoplay: { delay: 3500, ...CONFIG.autoplay },
    breakpoints: CONFIG.breakpoints.reviews
  });
};

// ====================================
// SCROLL BEHAVIORS
// ====================================
const initScrollBehaviors = () => {
  const navbar = document.querySelector('nav');
  const scrollToTopBtn = document.getElementById('scrollToTop');
  let scrollTimeout;

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
    threshold: 0.2, // Aparece cuando 20% es visible
    rootMargin: '0px 0px -100px 0px' // Ajuste para activar antes
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
// MODAL DE RESERVA
// ====================================
const initModal = () => {
  const modal = document.getElementById('modalReserva');
  const btnOpen = document.getElementById('btnReservar');
  const btnClose = document.getElementById('btnCerrarModal');
  const form = document.getElementById('modalBookingForm');

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
// CARRUSEL CON MINIATURAS - MEJORADA
// ====================================
const initExperienceCarousel = () => {
  const container = document.querySelector('.experience-carousel');
  if (!container) return;

  const images = container.querySelectorAll('.carousel-img');
  const thumbs = container.querySelectorAll('.thumb');
  let currentSlide = 0;
  let autoplayInterval;

  const showSlide = (index) => {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % images.length;
    showSlide(nextIndex);
  };

  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 4000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  // Auto-play
  startAutoplay();

  // Click en miniaturas
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  // Pausar auto-play al hacer hover
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
};

// ====================================
// ENVÍO DE FORMULARIOS CON ESTADOS
// ====================================
const initForms = () => {
  const forms = document.querySelectorAll('form[id="bookingForm"], form[id="modalBookingForm"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit-modal');
      const originalText = submitBtn.innerHTML;
      
      // Datos del formulario
      const formData = new FormData(form);
      const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        viajeros: formData.get('viajeros')
      };
      
      // Estado de carga
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('send_email.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Estado de éxito
          submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
          submitBtn.style.background = '#28a745';
          
          // Mostrar mensaje de éxito
          showNotification(result.message, 'success');
          
          // Resetear después de 2 segundos
          setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            
            // Cerrar modal si está abierto
            const modal = document.getElementById('modalReserva');
            if (modal.classList.contains('active')) {
              closeModal();
            }
          }, 2000);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        // Estado de error
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        submitBtn.style.background = '#dc3545';
        
        showNotification(error.message, 'error');
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });
};

// ====================================
// NOTIFICACIONES
// ====================================
const showNotification = (message, type = 'info') => {
  // Remover notificación existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animación de entrada
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
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
  initExperienceCarousel();
  initForms();
  initPriceHover();
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
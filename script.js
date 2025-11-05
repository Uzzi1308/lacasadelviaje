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

  // Submit form
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ ¡Solicitud enviada! Te contactaremos pronto.');
    closeModal();
    form.reset();
  });

  // Botones inline
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reservar-inline');
    if (btn) {
      e.preventDefault();
      openModal();
    }
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
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
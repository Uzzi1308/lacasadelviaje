
// FUNCIONALIDADES PRINCIPALES DE LA PÁGINA

// Este archivo maneja carruseles, animaciones, modales y comportamientos de scroll
// Requiere: config.js cargado previamente

// INICIALIZACIÓN DE CARRUSELES (SWIPER)

const initSwipers = () => {
  // Carrusel de Itinerario
  if (document.querySelector(".itinerarySwiper")) {
    new Swiper(".itinerarySwiper", {
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      allowTouchMove: true,
      autoplay: { 
        delay: 4000, 
        ...CONFIG.autoplay 
      },
      coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      pagination: { 
        el: ".swiper-pagination", 
        clickable: true 
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: CONFIG.breakpoints.itinerary
    });
  }

  // Carrusel de Reseñas
  if (document.querySelector(".reviewsSwiper")) {
    new Swiper(".reviewsSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      allowTouchMove: false,
      autoplay: { 
        delay: 3500, 
        ...CONFIG.autoplay 
      },
      breakpoints: CONFIG.breakpoints.reviews
    });
  }
};

// COMPORTAMIENTOS DE SCROLL

const initScrollBehaviors = () => {
  const navbar = document.querySelector('nav');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  // Navbar contraído y botón Scroll to Top
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;

    // Navbar contraído al hacer scroll
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollPos > CONFIG.scroll.navbarThreshold);
    }

    // Mostrar/ocultar botón Scroll to Top
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('show', scrollPos > CONFIG.scroll.scrollToTopThreshold);
    }
  }, { passive: true });

  // Acción del botón Scroll to Top
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};


// ANIMACIONES DE APARICIÓN (INTERSECTION OBSERVER)


const initScrollAnimations = () => {
  const observerOptions = {
    threshold: CONFIG.animations.threshold,
    rootMargin: CONFIG.animations.rootMargin
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Elementos a observar
  const elements = document.querySelectorAll(
    '.hero-text, .form-container, .experience-content, .experience-image-wrapper, ' +
    '.itinerary-card, .point, .featured-card, .destination-card, .review-card'
  );

  elements.forEach(el => observer.observe(el));
};

// MODAL DE RESERVA

const initModal = () => {
  const modal = document.getElementById('modalReserva');
  const btnOpen = document.getElementById('btnReservar');
  const btnClose = document.getElementById('btnCerrarModal');

  if (!modal) return;

  // Abrir modal
  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Cerrar modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event listeners básicos
  if (btnOpen) {
    btnOpen.addEventListener('click', openModal);
  }
  
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  // Cerrar con click fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Botones inline y tarjetas de precio que abren el modal
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

// EFECTOS DE HOVER EN TARJETAS DE PRECIO(migrar a css)

const initPriceHover = () => {
  const priceCards = document.querySelectorAll('.price-card');
  
  priceCards.forEach(card => {
    const priceElement = card.querySelector('.price');
    const originalPrice = priceElement.innerHTML;
    
    // Efecto al pasar el mouse
    card.addEventListener('mouseenter', () => {
      priceElement.innerHTML = '<span style="font-size: 0.8em;">¡Reserva Ahora!</span>';
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    // Restaurar al salir
    card.addEventListener('mouseleave', () => {
      priceElement.innerHTML = originalPrice;
      card.style.transform = '';
    });
    
    // Click para abrir modal (ya manejado en initModal, pero por si acaso)
    card.addEventListener('click', () => {
      const modal = document.getElementById('modalReserva');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
};

// SMOOTH SCROLL PARA ENLACES INTERNOS

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar si es solo "#" o "#!"
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// MENÚ MÓVIL (si lo agrego)

const initMobileMenu = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
};

// INICIALIZACIÓN PRINCIPAL

const init = () => {
  console.log('Inicializando funcionalidades de la página...');
  
  initSwipers();
  initScrollBehaviors();
  initScrollAnimations();
  initModal();
  initPriceHover();
  initSmoothScroll();
  initMobileMenu();
  
  console.log('Página inicializada correctamente');
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
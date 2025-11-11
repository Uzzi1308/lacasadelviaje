
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

// Configuración común de autoplay
const autoplayConfig = {
  disableOnInteraction: false,
  pauseOnMouseEnter: true
};

// Breakpoints comunes
const commonBreakpoints = {
  320: { slidesPerView: 1, spaceBetween: 20 },
  640: { slidesPerView: 1.5 },
  1024: { slidesPerView: 2.2 }
};

// Itinerary Swiper
const itinerarySwiper = new Swiper(".itinerarySwiper", {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: "auto",
  loop: true,
  allowTouchMove: false,
  autoplay: {
    delay: 4000,
    ...autoplayConfig
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
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 20 },
    768: { slidesPerView: 1.2, spaceBetween: 30 },
    1024: { slidesPerView: 1.3, spaceBetween: 40 }
  }
});

// Reviews Swiper
const reviewsSwiper = new Swiper(".reviewsSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  allowTouchMove: false,
  autoplay: {
    delay: 3500,
    ...autoplayConfig
  },
  breakpoints: commonBreakpoints
});
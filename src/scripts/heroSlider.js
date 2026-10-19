import Swiper from "swiper";
import { A11y, Autoplay, Navigation } from "swiper/modules";

function initSliders() {
  const sliders = document.querySelectorAll(".hero-slider");

  sliders.forEach((slider) => {
    const container = slider.querySelector(".hero-slider__swiper");
    const prevButton = slider.querySelector(".hero-slider__prev");
    const nextButton = slider.querySelector(".hero-slider__next");

    if (
      !(container instanceof HTMLElement) ||
      !(prevButton instanceof HTMLElement) ||
      !(nextButton instanceof HTMLElement)
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    new Swiper(container, {
      modules: [Navigation, Autoplay, A11y],

      slidesPerView: 1,
      loop: true,
      speed: 1500,

      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },

      autoplay: prefersReducedMotion
        ? false
        : {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          },

      a11y: {
        prevSlideMessage: "Imagem anterior",
        nextSlideMessage: "Imagem seguinte",
      },
    });
  });
}

document.addEventListener("astro:page-load", initSliders);

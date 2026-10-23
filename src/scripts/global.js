"use strict";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("astro:page-load", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  requestAnimationFrame(() => {
    gsapScrollAnimations();
    ScrollTrigger.refresh();
  });
});

////////////////////////////////////////////////////////////* GSAP scrolling animations *////////////////////////////////////////////////////////////////////////////////*

function gsapScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* return; */

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 10);

  ScrollTrigger.defaults({ markers: false });

  const animatedElements = document.querySelectorAll("[data-animate]:not([data-animate-group] [data-animate])");
  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    let animationStyles = { opacity: 0, duration: 1, ease: "power4.out" };

    switch (animationType) {
      case "fade-in":
      default:
        animationStyles = { ...animationStyles, scale: 0.92, duration: 1.25 };
        break;
    }

    gsap.from(el, {
      ...animationStyles,
      clearProps: "transform, opacity",
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 45%",
      },
    });
  });
}

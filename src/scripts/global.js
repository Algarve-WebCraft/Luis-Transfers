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

  ScrollTrigger.defaults({ markers: true }); // Enable markers to show where the scroller starts and ends while planning

  const animatedElements = document.querySelectorAll("[data-animate]:not([data-animate-group] [data-animate])");

  /* Add 'data-animate' to the elements you want to animate from the list below ie. data-animate="slide-up". */
  /* Add 'data-scrub' to make the elements slowly scrub in with the scroller instead of popping in as the trigger is hit. */
  /* Add 'data-reversible' to the elements you want to reverse the scrub animation when scrolling back up. */

  // Individual scroll animations (each element controlled by its own trigger).
  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    const isReversible = el.hasAttribute("data-reversible");
    const addScrub = el.hasAttribute("data-scrub");
    let animationStyles = { opacity: 0, duration: 1, ease: "power4.out" };

    switch (animationType) {
      case "slide-up":
        animationStyles = { ...animationStyles, y: 150 };
        break;
      case "slide-down":
        animationStyles = { ...animationStyles, y: -150 };
        break;
      case "slide-left":
        animationStyles = { ...animationStyles, x: -150 };
        break;
      case "slide-right":
        animationStyles = { ...animationStyles, x: 150 };
        break;
      case "slide-up-fast":
        animationStyles = { ...animationStyles, y: 150, duration: 0.2 };
        break;
      case "slide-down-fast":
        animationStyles = { ...animationStyles, y: -150, duration: 0.2 };
        break;
      case "slide-left-fast":
        animationStyles = { ...animationStyles, x: -150, duration: 0.2 };
        break;
      case "slide-right-fast":
        animationStyles = { ...animationStyles, x: 150, duration: 0.2 };
        break;
      case "fade-in":
      default:
        animationStyles = { ...animationStyles, scale: 0.8, duration: 1 };
        break;
      case "scale-up":
        animationStyles = { ...animationStyles, scale: 0.85, duration: 1.5 };
        break;
      case "scale-down":
        gsap.from(el, {
          scale: 1.75,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "transform, opacity",
          scrollTrigger: {
            scrub: addScrub ? 5 : false,
            once: isReversible ? false : true,
            trigger: el,
            start: "top 70%",
          },
        });
        return;
      case "shutter-left":
        animationStyles = {
          ...animationStyles,
          clipPath: "inset(0 100% 0 0)",
          opacity: 1,
          duration: 0.85,
          scrub: addScrub ? 5 : false,
          once: isReversible ? false : true,
        };
        break;
      case "shutter-horizontal":
        gsap.fromTo(
          el,
          { clipPath: "inset(0 50% 0 50%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 0.5,
            ease: "power1.out",
            clearProps: "transform, opacity",
            scrollTrigger: {
              scrub: addScrub ? 5 : false,
              once: isReversible ? false : true,
              trigger: el,
              start: "top 80%",
            },
          },
        );
        return;
      case "shutter-vertical":
        gsap.fromTo(
          el,
          { clipPath: "inset(50% 0 50% 0)" },
          {
            clipPath: "inset(-10% -10% -10% -10%)",
            duration: 2.5,
            ease: "power2.out",
            clearProps: "transform, opacity",
            scrollTrigger: {
              scrub: addScrub ? 5 : false,
              once: isReversible ? false : true,
              trigger: el,
              start: "top 75%",
            },
          },
        );
        return;
    }

    // Generic function handles the default 'from' animations if they are not specified in the switch above.
    gsap.from(el, {
      ...animationStyles,
      clearProps: "transform, opacity",
      scrollTrigger: {
        trigger: el,
        start: "top 50%",
        end: "top 45%",
        scrub: addScrub ? 5 : false, // Change number to increase or decrease the speed of the scrub when added.
        once: isReversible ? false : true,
        toggleActions: isReversible ? "play none none reverse" : "play none none none",
      },
    });
  });

  // Group scroll animations (multiple elements controlled by a single trigger).
  // Add 'data-animate-group' to the container of the elements you want to animate as a group and then add 'data-animate' to each specific element you want to animate.
  // Add 'data-animate-start="top 60%"' to the html element next to 'data-animate-group' to set whatever specific start point for that group, defaults to "top 70%".
  // Add 'data-animate-stagger="0.5"' to the html element next to 'data-animate-group' to set the stagger amount in seconds for that group if needed, defaults to "0".
  document.querySelectorAll("[data-animate-group]").forEach((group) => {
    const triggerStartPoint = group.dataset.animateStart || "top 70%";
    const staggerSeconds = group.dataset.animateStagger || "0";

    group.querySelectorAll("[data-animate]").forEach((el) => {
      const animationType = el.dataset.animate;
      let animationStyles = { opacity: 0, ease: "power4.out" };

      switch (animationType) {
        case "slide-left":
          animationStyles.x = -120;
          break;
        case "slide-right":
          animationStyles.x = 120;
          break;
        case "slide-up":
          animationStyles.y = 120;
          break;
        case "slide-down":
          animationStyles.y = -120;
          break;
      }

      // 'set' ensures the beginning styles are applied straight away so they can be animated to. Required to make group animations work as just 'from' does not work.
      gsap.set(el, animationStyles);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: triggerStartPoint,
        once: true,
      },
    });

    tl.to(group.querySelectorAll("[data-animate]"), {
      x: 0,
      y: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 1,
      stagger: staggerSeconds,
    });
  });
}

///////////////////////////////////////////////////////////////* Sticky navigation bar *//////////////////////////////////////////////////////////////////////////////*

function initStickyHeader() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navBar = document.querySelector(".nav-bar");

  function closeMenuSafely() {
    navBar.classList.remove("hamburger-btn__open");
    hamburgerBtn.classList.remove("active");
    setNavAttributes();
  }

  window.addEventListener("scroll", () => {
    const header = document.querySelector("#header");
    const isScrolled = window.scrollY > 400;
    const headerWasSticking = header.classList.contains("sticking");

    if (isScrolled && !headerWasSticking) {
      header.classList.add("sticking");
      closeMenuSafely();
    } else if (window.scrollY === 0 && headerWasSticking) {
      header.classList.remove("sticking");
      closeMenuSafely();
    }
  });
}

"use strict";

import { gsap } from "gsap";

export function gsapOpeningHomeAnimations() {
  const body = document.body;

  // Use isMobile to set different animation timings depending on screen size. Use this in place of timing - `${isMobile.matches ? "-=5.5" : "-=4.2"}`
  const isMobile = window.matchMedia("(max-width: 62.5rem)");

  if (!document.body.classList.contains("home")) return;

  // Use onComplete() to add the animation classs back in after that specific animation is finished.

  return;

  // Snaps to the top of the screen when the home page is loaded.
  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  });

  // Prevents the user from being able to scroll while opening animatons are running. Change to 'auto', in an onComplete() during an animation.
  if (body.classList.contains("home")) {
    document.documentElement.style.overflow = "hidden";
  }

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2,
  });

  //Use .set to set the initial state of the element before the animation starts if you need to make sure it is in the correct state for the intro animation.
  gsap.set(".cmp-main-btn--dark-btn", {
    transition: "none",
  });

  tl.fromTo(
    ".cmp-hero-heading",
    {
      clipPath: "inset(0 0 100% 0)",
    },
    {
      clipPath: "inset(0 0 0% 0)",
      duration: 2,
      ease: "power2.inOut",
    },
  )
    .from(
      ".cmp-main-text",
      {
        y: -30,
        opacity: 0,
        duration: 2,
      },
      "+=0.1",
    )
    .from(
      ".cmp-topper-heading",
      {
        y: 30,
        opacity: 0,
        duration: 2,
      },
      "-=1.75",
    )
    .from(
      ".hero-btn-container a:first-of-type",
      {
        opacity: 0,
        x: -100,
        duration: 2,
      },
      "-=1.5",
    )
    .from(
      ".hero-btn-container a:last-of-type",
      {
        opacity: 0,
        x: 100,
        duration: 2,
        clearProps: "all",
      },
      "-=2",
    )
    .from(
      ".header",
      {
        y: -30,
        opacity: 0,
        duration: 2,
      },
      "-=2",
    )
    .from(
      ".hero-image-container",
      {
        y: 30,
        opacity: 0,
        duration: 2,
      },
      "-=1",
    )
    .from(
      ".side-glow",
      {
        opacity: 0,
        duration: 2,
      },
      "-=3",
    );
}

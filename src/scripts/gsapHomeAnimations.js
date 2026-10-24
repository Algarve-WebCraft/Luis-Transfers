"use strict";

import { gsap } from "gsap";

export function gsapOpeningHomeAnimations() {
  const body = document.body;
  const html = document.documentElement;

  if (!body.classList.contains("home")) return;

  if (!html.classList.contains("home-intro-pending")) {
    gsap.set(body, { opacity: 1 });
    return;
  }

  gsap.fromTo(
    body,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 2.25,
      delay: 0.35,
      ease: "power4.out",
      onComplete: () => {
        html.classList.remove("home-intro-pending");
        body.classList.add("home-intro-complete");
        sessionStorage.setItem("home-intro-complete", "true");
      },
    },
  );
}

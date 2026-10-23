"use strict";

import { gsap } from "gsap";

export function gsapOpeningHomeAnimations() {
  const body = document.body;

  if (!document.body.classList.contains("home")) return;

  if (sessionStorage.getItem("home-intro-complete") === "true") {
    body.classList.add("home-intro-complete");
    gsap.set(body, { opacity: 1 });
    return;
  } 

  /* return; */

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2,

    onComplete: () => {
      body.classList.add("home-intro-complete");
      sessionStorage.setItem("home-intro-complete", "true");
    },
  });

  tl.from(
    "body",
    {
      opacity: 0,
      duration: 2.25,
    },
    "+=.4",
  );
}

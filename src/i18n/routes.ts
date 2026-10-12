export const routes = {
  en: {
    home: "",
    about: "about",
    menu: "menu",
    gallery: "gallery",
    contact: "contact",
  },
  pt: {
    home: "",
    about: "sobre",
    menu: "menu",
    gallery: "galeria",
    contact: "contacto",
  },
} as const;

export type Locale = keyof typeof routes;
export type Page = keyof typeof routes.en;
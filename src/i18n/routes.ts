export const routes = {
  en: {
    home: "",
    transfers: "transfers",
    cleaning: "cleaning",
    accomodation: "accomodation",
    contact: "contact",
  },
  pt: {
    home: "",
    transfers: "transferências",
    cleaning: "limpeza",
    accomodation: "alojamento",
    contact: "contacto",
  },
} as const;

export type Locale = keyof typeof routes;
export type Page = keyof typeof routes.en;
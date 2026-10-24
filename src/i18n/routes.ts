export const routes = {
  en: {
    home: "",
    transfers: "transfers",
    cleaning: "cleaning",
    rental: "rental",
    contact: "contact",
  },
  pt: {
    home: "",
    transfers: "transferencias",
    cleaning: "limpeza",
    rental: "alojamento",
    contact: "contacto",
  },
} as const;

export type Locale = keyof typeof routes;
export type Page = keyof typeof routes.en;

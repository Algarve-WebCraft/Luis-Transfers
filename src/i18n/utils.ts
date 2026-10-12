import { routes, type Locale, type Page } from "./routes";

export function getLocalizedPath(locale: Locale, page: Page) {
  const slug = routes[locale][page];

  if (locale === "en") {
    return slug ? `/${slug}/` : "/";
  }

  return slug ? `/pt/${slug}/` : "/pt/";
}

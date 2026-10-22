import intlTelInput from "intl-tel-input";

// Google loader logic for auto-suggestions
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;

  b = b[c] || (b[c] = {});
  // @ts-ignore
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));

        e.set("libraries", [...r] + "");

        for (k in g) {
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k],
          );
        }

        e.set("callback", c + ".maps." + q);

        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;

        d[q] = f;

        a.onerror = () => {
          h = n(Error(p + " could not load."));
        };
        // @ts-ignore
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";

        m.head.append(a);
      }));

  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyC3-FmJX-YRpgVmmipQsXQHX82p94Vc4-g",
  v: "weekly",
});

let dropoffInput = document.querySelector("#dropoff");

let pickupPlace = null;
let dropoffPlace = null;
let selectedFixedRoute = null;

const PRICING = {
  PRICE_PER_KM: 0.72,
  MINIMUM_PRICE: 15,
  FARO_AIRPORT_SURCHARGE: 7,

  NIGHT_SURCHARGE_22_00: 10,
  NIGHT_SURCHARGE_00_04: 15,
  NIGHT_SURCHARGE_04_06: 10,

  FARO_AIRPORT_PLACE_ID: "ChIJm5mnTbBSBQ0RRztnYx5VRCE",
};

const FIXED_PRICE_ROUTES = {
  Aljezur: "ChIJw4QJoFMVGw0Rxg_DN39zeBA",
  Alvor: "ChIJt2L-4hUvGw0RXHpRwBV_EAo",
  "Armacao de Pera": "ChIJ-4R1anHRGg0RNw4AP1RobOI",
  Burgau: "ChIJybRFApQ2Gw0R0Op_T8DrAAo",
  Carvoeiro: "ChIJUTdJ9BbWGg0Rfe-LY8sDUj4",
  Ferragudo: "ChIJNyON51MoGw0RrdBDJv3XexY",
  Lagoa: "ChIJqdPvp_7WGg0RyuVyn1Lyvyc",
  Lagos: "ChIJjU0jUEkwGw0RV_waR6OqEFQ",
  Luz: "ChIJEz67Bj4xGw0RCdaIxNlkeO8",
  Portimao: "ChIJYSkkqewoGw0R4RSAcSPJ_JM",
  Salema: "ChIJLxRPAxI2Gw0RVw2QO-I01fI",
  Sagres: "ChIJdwsRx2RMGw0RtKhwSX1u48w",
  Silves: "ChIJR7dMc_LZGg0RpqURX5Mg4s4",
};

async function getDrivingDistanceKm(pickupPlace, dropoffPlace) {
  const { Route } = await google.maps.importLibrary("routes");

  if (!pickupPlace || !dropoffPlace) {
    throw new Error("Pickup and drop-off locations are required.");
  }

  const { routes } = await Route.computeRoutes({
    origin: pickupPlace,
    destination: dropoffPlace,
    travelMode: "DRIVING",
    fields: ["distanceMeters"],
  });

  if (!routes?.length) {
    throw new Error("No driving route could be found.");
  }

  return routes[0].distanceMeters / 1000;
}

function calculateTimeSurcharge(pickupTime) {
  const [hours, minutes] = pickupTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes >= 22 * 60) {
    return PRICING.NIGHT_SURCHARGE_22_00;
  } else if (totalMinutes < 4 * 60) {
    return PRICING.NIGHT_SURCHARGE_00_04;
  } else if (totalMinutes < 6 * 60) {
    return PRICING.NIGHT_SURCHARGE_04_06;
  }

  return 0;
}

function calculatePrice(distanceKm, pickupPlace, pickupTime) {
  let price = distanceKm * PRICING.PRICE_PER_KM;

  if (distanceKm > 150) {
    const longDistanceKm = distanceKm - 150;
    price += Math.pow(longDistanceKm, 1.35) * 0.18;
  }

  price = Math.max(PRICING.MINIMUM_PRICE, price);

  if (pickupPlace?.id === PRICING.FARO_AIRPORT_PLACE_ID) {
    price += PRICING.FARO_AIRPORT_SURCHARGE;
  }

  price += calculateTimeSurcharge(pickupTime);

  return Math.round(price);
}

async function calculateBookingPrice() {
  if (!pickupPlace || !dropoffPlace) return;

  const priceOutput = document.querySelector("#price");

  if (selectedFixedRoute) {
    const timeInput = document.querySelector('input[type="time"]');
    const pickupTime = timeInput?.value;

    const surcharge = pickupTime ? calculateTimeSurcharge(pickupTime) : 0;

    priceOutput.textContent = ` €${Math.round(selectedFixedRoute.price + surcharge)}`;

    return;
  }

  priceOutput.textContent = "Calculating...";

  try {
    const distanceKm = await getDrivingDistanceKm(pickupPlace, dropoffPlace);

    const timeInput = document.querySelector('input[type="time"]');

    const price = calculatePrice(distanceKm, pickupPlace, timeInput.value);

    priceOutput.textContent = ` €${price}`;
  } catch (error) {
    console.error("Price calculation error:", error);
    priceOutput.textContent = "--";
  }
}

function getSelectedFixedRoute() {
  const routeName = new URLSearchParams(window.location.search).get("route");

  if (!routeName) return;

  const routeCard = [...document.querySelectorAll(".routes-card")].find((card) => card.dataset.routeName === routeName);

  if (!routeCard) return;

  const placeId = routeCard.dataset.placeId;
  const fixedPrice = Number(routeCard.dataset.fixedPrice);

  if (!placeId || !Number.isFinite(fixedPrice) || fixedPrice <= 0) {
    return;
  }

  return {
    name: routeName,
    placeId,
    price: fixedPrice,
  };
}

function clearSelectedFixedRoute() {
  if (!selectedFixedRoute) return;

  selectedFixedRoute = null;

  const priceOutput = document.querySelector("#price");

  if (priceOutput) {
    priceOutput.textContent = "--";
  }

  updateNotesForRoute();
}

async function applySelectedFixedRoute() {
  const route = getSelectedFixedRoute();
  const pickupInput = document.querySelector("#pickup");
  const dropoffInput = document.querySelector("#dropoff");

  if (!route || !pickupInput || !dropoffInput) return;

  try {
    const { Place } = await google.maps.importLibrary("places");

    const routePickup = new Place({
      id: route.placeId,
    });

    const airportDropoff = new Place({
      id: PRICING.FARO_AIRPORT_PLACE_ID,
    });

    const fields = ["displayName", "formattedAddress", "location"];

    await Promise.all([routePickup.fetchFields({ fields }), airportDropoff.fetchFields({ fields })]);

    if (!routePickup.location || !airportDropoff.location) {
      throw new Error("Could not retrieve the route locations.");
    }

    pickupPlace = routePickup;
    dropoffPlace = airportDropoff;
    selectedFixedRoute = route;
    updateNotesForRoute();

    pickupInput.value = route.name;
    dropoffInput.value = airportDropoff.displayName || "Faro International Airport (FAO), Faro, Portugal";

    pickupInput.setCustomValidity("");
    dropoffInput.setCustomValidity("");

    const priceOutput = document.querySelector("#price");
    const timeInput = document.querySelector('input[type="time"]');
    const pickupTime = timeInput?.value;

    if (priceOutput) {
      const surcharge = pickupTime ? calculateTimeSurcharge(pickupTime) : 0;

      priceOutput.textContent = ` €${Math.round(route.price + surcharge)}`;
    }
  } catch (error) {
    selectedFixedRoute = null;
    pickupPlace = null;
    dropoffPlace = null;

    console.error("Fixed-price route initialisation failed:", error);
  }
}

function validateLocations() {
  if (!pickupPlace?.id || !dropoffPlace?.id) {
    return;
  }

  if (pickupPlace.id === dropoffPlace.id) {
    dropoffInput.setCustomValidity("Pickup and drop-off locations cannot be the same.");
  } else {
    dropoffInput.setCustomValidity("");
  }
}

function updateNotesForRoute() {
  const notesInput = document.querySelector("#notes");
  if (!notesInput) return;

  if (selectedFixedRoute) {
    notesInput.required = true;
    notesInput.placeholder =
      "Por favor, forneça aqui o seu endereço completo de retirada, incluindo o nome e o número do imóvel, bem como o nome da rua.";
  } else {
    notesInput.required = false;
    notesInput.placeholder =
      "Necessita de cadeiras para criança (ISOFIX), paragem intermédia ou transporte de animais de estimação em caixa?";
  }
}

// Google maps auto-complete suggestion logic for pickup and drop off
async function initMapsAuto() {
  const pickupInput = document.querySelector("#pickup");
  const pickupSuggestions = document.querySelector("#pickup-suggestions");
  const dropoffInput = document.querySelector("#dropoff");
  const dropoffSuggestions = document.querySelector("#dropoff-suggestions");

  const { AutocompleteSuggestion, AutocompleteSessionToken } = await google.maps.importLibrary("places");

  async function setupAutocomplete(input, suggestionsList, setPlace) {
    if (!input || !suggestionsList) return;

    let sessionToken = new AutocompleteSessionToken();
    let debounceTimer;
    let latestRequest = 0;

    input.setCustomValidity("Please select a location from the suggestions.");

    input.addEventListener("input", () => {
      clearSelectedFixedRoute();
      setPlace(null);
      input.setCustomValidity("Please select a location from the suggestions.");

      const value = input.value.trim();
      const requestId = ++latestRequest;

      clearTimeout(debounceTimer);

      if (value.length < 3) {
        suggestionsList.innerHTML = "";
        suggestionsList.classList.remove("is-open");
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value,
            includedRegionCodes: ["pt", "es"],
            sessionToken,
          });

          if (requestId !== latestRequest) return;

          suggestionsList.innerHTML = "";

          suggestions.forEach((suggestion) => {
            const prediction = suggestion.placePrediction;
            if (!prediction) return;

            const item = document.createElement("li");
            item.textContent = prediction.text?.toString() ?? "";

            item.addEventListener("click", async () => {
              const place = prediction.toPlace();

              await place.fetchFields({
                fields: ["displayName", "formattedAddress", "location"],
              });

              setPlace(place);
              input.value = prediction.text?.toString() ?? "";
              input.setCustomValidity("");

              suggestionsList.innerHTML = "";
              suggestionsList.classList.remove("is-open");

              validateLocations();
              sessionToken = new AutocompleteSessionToken();
              calculateBookingPrice();
            });

            suggestionsList.appendChild(item);
          });

          suggestionsList.classList.toggle("is-open", suggestionsList.children.length > 0);
        } catch (error) {
          console.error("Autocomplete error:", error);
        }
      }, 200);
    });
  }

  setupAutocomplete(pickupInput, pickupSuggestions, (place) => {
    pickupPlace = place;
  });

  setupAutocomplete(dropoffInput, dropoffSuggestions, (place) => {
    dropoffPlace = place;
  });

  selectedFixedRoute = null;
  await applySelectedFixedRoute();

  const timeInput = document.querySelector('input[type="time"]');

  timeInput?.addEventListener("change", calculateBookingPrice);
}
document.addEventListener("astro:page-load", initMapsAuto);

window.getBookingLocations = () => ({
  pickup: pickupPlace,
  dropoff: dropoffPlace,
});

// Form submission logic
const form = document.querySelector("#booking-form");
const dateInput = form.querySelector('input[type="date"]');
let iti;

const appsScriptUrl =
  "https://script.google.com/macros/s/AKfycbw4H1RmVYHh4BEVFu_lxPLJqgy_N6R1Uqms0OAqW8mroVkJhKgUg56WxdUypUBL1Ew1/exec";

function initPhoneInput() {
  const phoneInput = document.querySelector("#phone");

  if (!phoneInput) return;

  iti = intlTelInput(phoneInput, {
    initialCountry: "pt",
    separateDialCode: true,
    loadUtils: () => import("intl-tel-input/utils"),
  });
}
document.addEventListener("astro:page-load", initPhoneInput);

function initDateInput() {
  const dateInput = document.querySelector('#booking-form input[type="date"]');

  if (!dateInput) return;

  const today = new Date();
  const localDate = today.toLocaleDateString("en-CA");

  dateInput.min = localDate;
}
document.addEventListener("astro:page-load", initDateInput);

document.addEventListener("submit", async (event) => {
  const form = event.target;

  if (!(form instanceof HTMLFormElement) || form.id !== "booking-form") {
    return;
  }

  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton || submitButton.disabled) return;

  submitButton.disabled = true;

  try {
    if (!iti) {
      throw new Error("Phone input has not been initialised.");
    }

    await iti.promise;

    if (!iti.isValidNumber()) {
      submitButton.disabled = false;
      console.error("Invalid phone number:", iti.getValidationError());
      return;
    }

    const formData = new FormData(form);
    const locations = window.getBookingLocations();

    const pickupTime = formData.get("time");

    const price = selectedFixedRoute
      ? Math.round(selectedFixedRoute.price + calculateTimeSurcharge(pickupTime))
      : calculatePrice(await getDrivingDistanceKm(locations.pickup, locations.dropoff), locations.pickup, pickupTime);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: iti.getNumber(),
      pickup: formData.get("pickup"),
      dropoff: formData.get("dropoff"),
      pickupPlaceId: locations.pickup?.id ?? null,
      pickupLatitude: locations.pickup?.location?.lat() ?? null,
      pickupLongitude: locations.pickup?.location?.lng() ?? null,
      dropoffPlaceId: locations.dropoff?.id ?? null,
      dropoffLatitude: locations.dropoff?.location?.lat() ?? null,
      dropoffLongitude: locations.dropoff?.location?.lng() ?? null,
      price,
      date: formData.get("date"),
      time: formData.get("time"),
      passengers: formData.get("passengers"),
      bags: formData.get("bags"),
      departTime: formData.get("depart-time"),
      arriveTime: formData.get("arrive-time"),
      notes: formData.get("notes"),
    };

    fetch(appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    const locale = form.dataset.locale;

    window.location.href = locale === "en" ? "/confirmation/" : "/pt/confirmação/";
  } catch (error) {
    console.error("Submission error:", error);
    submitButton.disabled = false;
  }
});

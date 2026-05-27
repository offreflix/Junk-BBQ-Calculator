export const PRICES = {
  meat: 38,
  beer: 5,
  water: 4,
  charcoal: 25,
  spirits: 85,
};

export function meatPerPerson(duration) {
  return duration >= 6 ? 750 : 600;
}

export function beerPerPerson(duration) {
  return duration >= 6 ? 2000 : 1200;
}

export function waterPerPerson(duration) {
  return duration >= 6 ? 1500 : 1000;
}

export function destiladosBottles(adults, days, intensity) {
  const divisor = { pouco: 8, medio: 5, muito: 3 };
  return Math.max(1, Math.ceil(adults / (divisor[intensity] || 8))) * days;
}

export function calcChurrasco({ adults, kids, duration, hasDestilados, intensity }) {
  const meatPerA = meatPerPerson(duration);
  const meatQnt = meatPerA * adults + (meatPerA / 2) * kids;
  const rawBeer = beerPerPerson(duration) * adults;
  const waterPerA = waterPerPerson(duration);
  const waterQnt = waterPerA * adults + (waterPerA / 2) * kids;
  const beerCans = Math.ceil((hasDestilados ? rawBeer * 0.6 : rawBeer) / 355);

  const costs = {
    Carne: Math.round((meatQnt / 1000) * PRICES.meat),
    Cerveja: Math.round(beerCans * PRICES.beer),
    Bebidas: Math.round(Math.ceil(waterQnt / 1000) * PRICES.water),
  };

  let bottles = 0;
  if (hasDestilados) {
    bottles = destiladosBottles(adults, 1, intensity);
    costs["Destilados"] = Math.round(bottles * PRICES.spirits);
  }

  return { meatQnt, beerCans, waterQnt, bottles, costs };
}

export function calcSitioEvent({ adults, kids, days, hasDestilados, intensity }) {
  const meatPerA = meatPerPerson(6);
  const meatQnt = (meatPerA * adults + (meatPerA / 2) * kids) * days;
  const rawBeerCans = Math.ceil(beerPerPerson(6) / 355) * adults * days;
  const waterQnt = waterPerPerson(6) * (adults + kids) * days;
  const charcoalKg = Math.max(2, Math.ceil((adults + kids) / 4)) * days;
  const beerCans = hasDestilados ? Math.ceil(rawBeerCans * 0.6) : rawBeerCans;

  const costs = {
    Carne: Math.round((meatQnt / 1000) * PRICES.meat),
    Cerveja: Math.round(beerCans * PRICES.beer),
    Bebidas: Math.round(Math.ceil(waterQnt / 1000) * PRICES.water),
    Carvão: Math.round(charcoalKg * PRICES.charcoal),
  };

  let bottles = 0;
  if (hasDestilados) {
    bottles = destiladosBottles(adults, days, intensity);
    costs["Destilados"] = Math.round(bottles * PRICES.spirits);
  }

  return { meatQnt, beerCans, waterQnt, charcoalKg, bottles, costs };
}

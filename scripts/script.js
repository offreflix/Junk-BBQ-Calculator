// Elements
let inputAdults = document.getElementById("adults");
let inputKids = document.getElementById("kids");
let inputDuration = document.getElementById("duration");
let inputResult = document.getElementById("result");

// --- Theme ---
function initTheme() {
  const saved = localStorage.getItem("theme") || "";
  document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("theme-btn").textContent = saved === "dark" ? "☾" : "☀";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  document.getElementById("theme-btn").textContent = next === "dark" ? "☾" : "☀";
}

initTheme();

// --- Tabs ---
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  document.getElementById("tab-btn-" + name).classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

// --- Destilados ---
function toggleDestilados(tab) {
  const options = document.getElementById("destilados-options-" + tab);
  const enabled = document.getElementById("destilados-" + tab).checked;
  options.classList.toggle("hidden", !enabled);
}

function setIntensity(tab, level) {
  const container = document.getElementById("destilados-options-" + tab);
  container.querySelectorAll(".intensity-btn").forEach(btn => btn.classList.remove("active"));
  container.querySelector(`[data-level="${level}"]`).classList.add("active");
}

function getIntensity(tab) {
  const container = document.getElementById("destilados-options-" + tab);
  const active = container.querySelector(".intensity-btn.active");
  return active ? active.dataset.level : "pouco";
}

function isDestiladosEnabled(tab) {
  return document.getElementById("destilados-" + tab).checked;
}

function destiladosBottles(adults, days, intensity) {
  const perEventPerDay = {
    pouco: Math.max(1, Math.ceil(adults / 8)),
    medio: Math.max(1, Math.ceil(adults / 5)),
    muito: Math.max(1, Math.ceil(adults / 3)),
  };
  return (perEventPerDay[intensity] || 1) * days;
}

// --- Prices (BRL approx.) ---
const PRICES = {
  meat: 38,
  beer: 5,
  water: 4,
  charcoal: 25,
  spirits: 85,
};

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function costHTML(costs) {
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  const rows = Object.entries(costs)
    .map(([label, val]) => `<div class="cost-row"><span>${label}</span><span>${formatBRL(val)}</span></div>`)
    .join("");
  return `
    <div class="cost-estimate">
      <p class="cost-title">Estimativa de custo</p>
      ${rows}
      <div class="cost-total"><span>Total estimado</span><span>${formatBRL(total)}</span></div>
    </div>
  `;
}

// --- Churrasco ---
function calc() {
  const adults = Number(inputAdults.value);
  const kids = Number(inputKids.value);
  const duration = Number(inputDuration.value);

  if (!inputAdults.value || !inputKids.value || !inputDuration.value) {
    inputResult.innerHTML = '<p style="color: var(--color-neutral-500); text-align: center;">Preencha todos os campos</p>';
    return;
  }

  const meatQnt = meatPerPerson(duration) * adults + (meatPerPerson(duration) / 2) * kids;
  const rawBeer = beerPerPerson(duration) * adults;
  const waterQnt = waterPerPerson(duration) * adults + (waterPerPerson(duration) / 2) * kids;

  const hasDestilados = isDestiladosEnabled("churrasco");
  const beerCans = Math.ceil((hasDestilados ? rawBeer * 0.6 : rawBeer) / 355);

  const costs = {
    "Carne": Math.round((meatQnt / 1000) * PRICES.meat),
    "Cerveja": Math.round(beerCans * PRICES.beer),
    "Bebidas": Math.round(Math.ceil(waterQnt / 1000) * PRICES.water),
  };

  let destiladosHTML = "";
  if (hasDestilados) {
    const intensity = getIntensity("churrasco");
    const bottles = destiladosBottles(adults, 1, intensity);
    costs["Destilados"] = Math.round(bottles * PRICES.spirits);
    destiladosHTML = `
      <div class="result-item">
        <p>Destilados</p>
        <span>${bottles} garrafa${bottles !== 1 ? "s" : ""}</span>
      </div>`;
  }

  inputResult.innerHTML = `
    <div class="result-summary">${duration2(adults, kids, duration)}</div>
    <div class="result-item"><p>Carne</p><span>${(meatQnt / 1000).toFixed(1)} kg</span></div>
    <div class="result-item"><p>Cerveja</p><span>${beerCans} latas</span></div>
    <div class="result-item"><p>Bebidas</p><span>${waterQnt2(waterQnt)}</span></div>
    ${destiladosHTML}
    ${costHTML(costs)}
  `;
}

// --- Sítio ---
function calcSitio() {
  const adults = Number(document.getElementById("sitio-adults").value);
  const kids = Number(document.getElementById("sitio-kids").value);
  const days = Number(document.getElementById("sitio-days").value);
  const result = document.getElementById("sitio-result");

  if (!document.getElementById("sitio-adults").value ||
      !document.getElementById("sitio-kids").value ||
      !document.getElementById("sitio-days").value) {
    result.innerHTML = '<p style="color: var(--color-neutral-500); text-align: center;">Preencha todos os campos</p>';
    return;
  }

  const meatQnt = (750 * adults + 375 * kids) * days;
  const rawBeerCans = Math.ceil(2000 / 355) * adults * days;
  const waterQnt = 1500 * (adults + kids) * days;
  const charcoalKg = Math.max(2, Math.ceil((adults + kids) / 4)) * days;

  const hasDestilados = isDestiladosEnabled("sitio");
  const beerCans = hasDestilados ? Math.ceil(rawBeerCans * 0.6) : rawBeerCans;

  const costs = {
    "Carne": Math.round((meatQnt / 1000) * PRICES.meat),
    "Cerveja": Math.round(beerCans * PRICES.beer),
    "Bebidas": Math.round(Math.ceil(waterQnt / 1000) * PRICES.water),
    "Carvão": Math.round(charcoalKg * PRICES.charcoal),
  };

  let destiladosHTML = "";
  if (hasDestilados) {
    const intensity = getIntensity("sitio");
    const bottles = destiladosBottles(adults, days, intensity);
    costs["Destilados"] = Math.round(bottles * PRICES.spirits);
    destiladosHTML = `
      <div class="result-item">
        <p>Destilados</p>
        <span>${bottles} garrafa${bottles !== 1 ? "s" : ""}</span>
      </div>`;
  }

  const total = adults + kids;
  const totalText = total !== 1 ? `${total} pessoas` : `${total} pessoa`;
  const daysText = days !== 1 ? `${days} dias` : `${days} dia`;

  result.innerHTML = `
    <div class="result-summary"><p><strong>Para ${daysText} de sítio com ${totalText}</strong></p></div>
    <div class="result-item"><p>Carne</p><span>${(meatQnt / 1000).toFixed(1)} kg</span></div>
    <div class="result-item"><p>Cerveja</p><span>${beerCans} latas</span></div>
    <div class="result-item"><p>Bebidas</p><span>${waterQnt2(waterQnt)}</span></div>
    <div class="result-item"><p>Carvão</p><span>${charcoalKg} kg</span></div>
    ${destiladosHTML}
    ${costHTML(costs)}
  `;
}

// --- Helpers ---
function waterQnt2(waterQnt) {
  const count = Math.ceil(waterQnt / 1000);
  return count !== 1 ? `${count} litros` : `${count} litro`;
}

function duration2(adults, kids, duration) {
  const total = adults + kids;
  const totalText = total !== 1 ? `${total} pessoas` : `${total} pessoa`;
  const durationText = duration > 1 ? `${duration} horas` : duration == 1 ? `${duration} hora` : "seu churrasco";
  return `<p><strong>Para ${durationText} com ${totalText}</strong></p>`;
}

function meatPerPerson(duration) {
  return duration >= 6 ? 750 : 600;
}

function beerPerPerson(duration) {
  return duration >= 6 ? 2000 : 1200;
}

function waterPerPerson(duration) {
  return duration >= 6 ? 1500 : 1000;
}

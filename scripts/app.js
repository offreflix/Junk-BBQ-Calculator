import { calcChurrasco, calcSitioEvent } from './calculator.js';

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

// --- Tabs ---
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  document.getElementById("tab-btn-" + name).classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

// --- Kids toggle ---
function toggleKids(tab) {
  const wrapper = document.getElementById("kids-input-" + tab);
  const enabled = document.getElementById("kids-toggle-" + tab).checked;
  wrapper.classList.toggle("hidden", !enabled);
  if (!enabled) document.getElementById(tab + "-kids").value = "";
}

function getKids(tab) {
  if (!document.getElementById("kids-toggle-" + tab).checked) return 0;
  return Number(document.getElementById(tab + "-kids").value) || 0;
}

// --- Destilados ---
function toggleDestilados(tab) {
  const enabled = document.getElementById("destilados-" + tab).checked;
  document.getElementById("destilados-options-" + tab).classList.toggle("hidden", !enabled);
}

function setIntensity(tab, level) {
  const container = document.getElementById("destilados-options-" + tab);
  container.querySelectorAll(".intensity-btn").forEach(btn => btn.classList.remove("active"));
  container.querySelector(`[data-level="${level}"]`).classList.add("active");
}

function getIntensity(tab) {
  const active = document.getElementById("destilados-options-" + tab).querySelector(".intensity-btn.active");
  return active ? active.dataset.level : "pouco";
}

function isDestiladosEnabled(tab) {
  return document.getElementById("destilados-" + tab).checked;
}

// --- Formatters ---
function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function pluralize(count, singular, plural) {
  return `${count} ${count !== 1 ? plural : singular}`;
}

function resultItemHTML(label, value) {
  return `<div class="result-item"><p>${label}</p><span>${value}</span></div>`;
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

// --- Calc handlers ---
function calc() {
  const adultsEl = document.getElementById("churrasco-adults");
  const durationEl = document.getElementById("churrasco-duration");
  const result = document.getElementById("result");

  if (!adultsEl.value || !durationEl.value) {
    result.innerHTML = '<p class="result-empty">Preencha todos os campos</p>';
    return;
  }

  const adults = Number(adultsEl.value);
  const kids = getKids("churrasco");
  const duration = Number(durationEl.value);
  const hasDestilados = isDestiladosEnabled("churrasco");
  const intensity = getIntensity("churrasco");

  const { meatQnt, beerCans, waterQnt, bottles, costs } = calcChurrasco({ adults, kids, duration, hasDestilados, intensity });

  const total = adults + kids;
  const durationLabel = duration === 0
    ? "seu churrasco"
    : pluralize(duration, "hora", "horas");

  result.innerHTML = `
    <div class="result-summary"><p><strong>Para ${durationLabel} com ${pluralize(total, "pessoa", "pessoas")}</strong></p></div>
    ${resultItemHTML("Carne", `${(meatQnt / 1000).toFixed(1)} kg`)}
    ${resultItemHTML("Cerveja", pluralize(beerCans, "lata", "latas"))}
    ${resultItemHTML("Bebidas", pluralize(Math.ceil(waterQnt / 1000), "litro", "litros"))}
    ${hasDestilados ? resultItemHTML("Destilados", pluralize(bottles, "garrafa", "garrafas")) : ""}
    ${costHTML(costs)}
  `;
}

function calcSitio() {
  const adultsEl = document.getElementById("sitio-adults");
  const daysEl = document.getElementById("sitio-days");
  const result = document.getElementById("sitio-result");

  if (!adultsEl.value || !daysEl.value) {
    result.innerHTML = '<p class="result-empty">Preencha todos os campos</p>';
    return;
  }

  const adults = Number(adultsEl.value);
  const kids = getKids("sitio");
  const days = Number(daysEl.value);
  const hasDestilados = isDestiladosEnabled("sitio");
  const intensity = getIntensity("sitio");

  const { meatQnt, beerCans, waterQnt, charcoalKg, bottles, costs } = calcSitioEvent({ adults, kids, days, hasDestilados, intensity });

  const total = adults + kids;

  result.innerHTML = `
    <div class="result-summary"><p><strong>Para ${pluralize(days, "dia", "dias")} de sítio com ${pluralize(total, "pessoa", "pessoas")}</strong></p></div>
    ${resultItemHTML("Carne", `${(meatQnt / 1000).toFixed(1)} kg`)}
    ${resultItemHTML("Cerveja", pluralize(beerCans, "lata", "latas"))}
    ${resultItemHTML("Bebidas", pluralize(Math.ceil(waterQnt / 1000), "litro", "litros"))}
    ${resultItemHTML("Carvão", `${charcoalKg} kg`)}
    ${hasDestilados ? resultItemHTML("Destilados", pluralize(bottles, "garrafa", "garrafas")) : ""}
    ${costHTML(costs)}
  `;
}

// --- Init ---
initTheme();

document.getElementById("theme-btn").addEventListener("click", toggleTheme);

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

["churrasco", "sitio"].forEach(tab => {
  document.getElementById("kids-toggle-" + tab).addEventListener("change", () => toggleKids(tab));
  document.getElementById("destilados-" + tab).addEventListener("change", () => toggleDestilados(tab));
  document.querySelectorAll(`#destilados-options-${tab} .intensity-btn`).forEach(btn => {
    btn.addEventListener("click", () => setIntensity(tab, btn.dataset.level));
  });
});

document.getElementById("calc-churrasco").addEventListener("click", calc);
document.getElementById("calc-sitio").addEventListener("click", calcSitio);

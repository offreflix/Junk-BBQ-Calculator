
// Elements that I will use
let inputAdults = document.getElementById("adults");
let inputKids = document.getElementById("kids");
let inputDuration = document.getElementById("duration");
let inputResult = document.getElementById("result");

// Theme
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

// Tabs
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
  document.getElementById("tab-btn-" + name).classList.add("active");
  document.getElementById("tab-" + name).classList.add("active");
}

function calc() {
  let adults = inputAdults.value;
  let kids = inputKids.value;
  let duration = inputDuration.value;

  if (!adults || !kids || !duration) {
    inputResult.innerHTML = '<p style="color: var(--color-neutral-500); text-align: center;">Preencha todos os campos</p>';
    return;
  }

  let meatQnt =
    meatPerPerson(duration) * adults + (meatPerPerson(duration) / 2) * kids;
  let beerQnt = beerPerPerson(duration) * adults;
  let waterQnt =
    waterPerPerson(duration) * adults + (waterPerPerson(duration) / 2) * kids;

  let summary = duration2(adults, kids, duration);

  inputResult.innerHTML = `
    <div class="result-summary">
      ${summary}
    </div>
    <div class="result-item">
      <p>Carne</p>
      <span>${(meatQnt / 1000).toFixed(1)} kg</span>
    </div>
    <div class="result-item">
      <p>Cerveja</p>
      <span>${Math.ceil(beerQnt / 355)} latas</span>
    </div>
    <div class="result-item">
      <p>Bebidas</p>
      <span>${waterQnt2(waterQnt)}</span>
    </div>
  `;
}


function waterQnt2(waterQnt) {
  let waterCount = Math.ceil(waterQnt / 1000);
  return waterCount > 1 ? `${waterCount} litros` : `${waterCount} litro`;
}


function duration2(adults, kids, duration) {
  let total = Number(adults) + Number(kids);
  let totalPlural = total > 1 ? `${total} pessoas` : `${total} pessoa`;
  let durationText = duration > 1 ? `${duration} horas` : duration == 1 ? `${duration} hora` : 'seu churrasco';
  return `<p><strong>Para ${durationText} com ${totalPlural}</strong></p>`;
}


// Getting amount of food based on Hour
function meatPerPerson(duration) {
  if (duration >= 6) {
    return 750;
  } else {
    return 600;
  }
}



function beerPerPerson(duration) {
  if (duration >= 6) {
    return 2000;
  } else {
    return 1200;
  }
}



function waterPerPerson(duration) {
  if (duration >= 6) {
    return 1500;
  } else {
    return 1000;
  }
}


// Sítio calculator
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
  const beerQnt = Math.ceil(2000 / 355) * adults * days;
  const waterQnt = (1500 * adults + 1500 * kids) * days;
  const charcoalKg = Math.max(2, Math.ceil((adults + kids) / 4)) * days;

  const total = adults + kids;
  const totalText = total > 1 ? `${total} pessoas` : `${total} pessoa`;
  const daysText = days > 1 ? `${days} dias` : `${days} dia`;

  result.innerHTML = `
    <div class="result-summary">
      <p><strong>Para ${daysText} de sítio com ${totalText}</strong></p>
    </div>
    <div class="result-item">
      <p>Carne</p>
      <span>${(meatQnt / 1000).toFixed(1)} kg</span>
    </div>
    <div class="result-item">
      <p>Cerveja</p>
      <span>${beerQnt} latas</span>
    </div>
    <div class="result-item">
      <p>Bebidas</p>
      <span>${waterQnt2(waterQnt)}</span>
    </div>
    <div class="result-item">
      <p>Carvão</p>
      <span>${charcoalKg} kg</span>
    </div>
  `;
}






// Elements that I will use 
let inputAdults = document.getElementById("adults");
let inputKids = document.getElementById("kids");
let inputDuration = document.getElementById("duration");
let inputResult = document.getElementById("result");

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

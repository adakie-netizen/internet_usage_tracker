const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "internet-usage-tracker-entries";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function number(id) {
  return Number($(id).value) || 0;
}

function formatGo(value) {
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} Go`;
}

function calculate() {
  const planSize = number("planSize");
  const planDays = Math.max(1, number("planDays"));
  const currentDay = Math.min(Math.max(1, number("currentDay")), planDays);
  const used = Math.max(0, number("usedData"));
  const remaining = Math.max(0, planSize - used);
  const daysRemaining = Math.max(0, planDays - currentDay + 1);
  const budget = daysRemaining ? remaining / daysRemaining : 0;
  const average = currentDay ? used / currentDay : 0;
  const percent = planSize ? Math.min(100, (used / planSize) * 100) : 0;

  $("remaining").textContent = formatGo(remaining);
  $("dailyBudget").textContent = `${budget.toLocaleString("fr-FR", {maximumFractionDigits: 2})} Go`;
  $("dailyAverage").textContent = `${average.toLocaleString("fr-FR", {maximumFractionDigits: 2})} Go/j`;
  $("daysRemaining").textContent = daysRemaining;
  $("percent").textContent = `${percent.toFixed(1)}%`;
  $("progressBar").style.width = `${percent}%`;

  const status = $("status");
  if (used > planSize) {
    status.className = "status bad";
    status.textContent = `Vous avez dépassé le forfait de ${formatGo(used - planSize)}.`;
  } else if (daysRemaining && budget < average * 0.8 && average > 0) {
    status.className = "status warn";
    status.textContent = `Votre rythme actuel est supérieur au budget nécessaire pour tenir jusqu'à la fin.`;
  } else if (used === 0) {
    status.className = "status neutral";
    status.textContent = "Entrez votre consommation pour commencer.";
  } else {
    status.className = "status good";
    status.textContent = "Votre consommation est compatible avec le budget restant.";
  }
}

function renderEntries() {
  const container = $("entries");
  container.innerHTML = "";
  if (!entries.length) {
    container.innerHTML = '<div class="empty">Aucune entrée pour le moment.</div>';
    return;
  }

  [...entries].sort((a, b) => a.day - b.day).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "entry";
    row.innerHTML = `
      <strong>Jour ${entry.day}</strong>
      <span>${entry.usage.toLocaleString("fr-FR", {maximumFractionDigits: 2})} Go</span>
      <button class="delete" aria-label="Supprimer">Supprimer</button>
    `;
    row.querySelector(".delete").addEventListener("click", () => {
      entries = entries.filter(e => e.id !== entry.id);
      saveEntries();
      renderEntries();
    });
    container.appendChild(row);
  });
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

$("calculateBtn").addEventListener("click", calculate);

$("entryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const day = Math.max(1, number("entryDay"));
  const usage = Math.max(0, number("entryUsage"));
  entries.push({ id: Date.now(), day, usage });
  saveEntries();
  renderEntries();
  $("entryDay").value = "";
  $("entryUsage").value = "";
});

$("resetBtn").addEventListener("click", () => {
  entries = [];
  localStorage.removeItem(STORAGE_KEY);
  $("planSize").value = 20;
  $("planDays").value = 30;
  $("currentDay").value = 1;
  $("usedData").value = 0;
  renderEntries();
  calculate();
});

["planSize", "planDays", "currentDay", "usedData"].forEach(id => {
  $(id).addEventListener("input", calculate);
});

renderEntries();
calculate();

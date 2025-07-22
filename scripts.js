const languageSelect = document.getElementById("languageSelect");
const periodSelect = document.getElementById("periodSelect");
const resultsContainer = document.getElementById("textResults");

let allTexts = [];

const periods = [
  { label: "1500–500 BCE", range: [ -1500, -500 ] },
  { label: "500 BCE – 500 CE", range: [ -500, 500 ] },
  { label: "500–1200 CE", range: [ 500, 1200 ] },
  { label: "1200–1600 CE", range: [ 1200, 1600 ] },
  { label: "1600–1800 CE", range: [ 1600, 1800 ] }
];

// Load data
fetch("data/texts.json")
  .then(res => res.json())
  .then(data => {
    allTexts = data;
    populateLanguageOptions(data);
    populatePeriodOptions();
  });

// Populate language dropdown
function populateLanguageOptions(data) {
  const languages = [...new Set(data.map(t => t.language))].sort();
  languages.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  });
}

// Populate period dropdown
function populatePeriodOptions() {
  periods.forEach(p => {
    const option = document.createElement("option");
    option.value = p.label;
    option.textContent = p.label;
    periodSelect.appendChild(option);
  });
}

// Event listeners
languageSelect.addEventListener("change", filterTexts);
periodSelect.addEventListener("change", filterTexts);

function filterTexts() {
  const selectedLang = languageSelect.value;
  const selectedPeriod = periodSelect.value;

  if (!selectedLang || !selectedPeriod) {
    resultsContainer.innerHTML = `<p>Please select both language and time period.</p>`;
    return;
  }

  const periodRange = periods.find(p => p.label === selectedPeriod).range;

  const filtered = allTexts.filter(text =>
    text.language === selectedLang &&
    text.year >= periodRange[0] &&
    text.year <= periodRange[1]
  );

  displayResults(filtered);
}

function displayResults(texts) {
  if (texts.length === 0) {
    resultsContainer.innerHTML = `<p>No texts found for this selection.</p>`;
    return;
  }

  resultsContainer.innerHTML = "";
  texts.forEach(text => {
    const card = document.createElement("div");
    card.className = "text-card";
    card.innerHTML = `
      <h3>${text.title}</h3>
      <p><strong>Author:</strong> ${text.author || "Unknown"}</p>
      <p><strong>Year:</strong> ${text.year}</p>
      <p><strong>Summary:</strong> ${text.summary}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

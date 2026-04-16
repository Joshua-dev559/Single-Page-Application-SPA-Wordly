const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");

form.addEventListener("submit", handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const word = input.value.trim();

  if (!word) {
    results.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  fetchWord(word);
}

async function fetchWord(word) {
  try {
    results.innerHTML = "<p>Loading...</p>";

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    displayData(data);

  } catch (error) {
    results.innerHTML = `<p>No results found. Try another word.</p>`;
  }
}

function displayData(data) {
  const entry = data[0];

  const word = entry.word;
  const phonetic = entry.phonetic || "No pronunciation available";

  let audioUrl = "";
  if (entry.phonetics && entry.phonetics.length > 0) {
    audioUrl = entry.phonetics.find(p => p.audio)?.audio || "";
  }

  let meaningsHTML = "";

  entry.meanings.forEach(meaning => {
    meaning.definitions.forEach(def => {
      meaningsHTML += `
        <p class="definition">• ${def.definition}</p>
      `;
    });
  });

  results.innerHTML = `
    <div class="word-title">${word}</div>
    <p><strong>Pronunciation:</strong> ${phonetic}</p>

    ${
      audioUrl
        ? `<audio controls src="${audioUrl}"></audio>`
        : "<p>No audio available</p>"
    }

    <h3>Definitions:</h3>
    ${meaningsHTML}
  `;
}
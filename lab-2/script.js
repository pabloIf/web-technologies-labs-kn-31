const output = document.getElementById("output");
const refreshBtn = document.getElementById("refresh");

async function getPokemonFetch() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/25");
    if (!response.ok) throw new Error("error load (fetch)");
    const data = await response.json();

    return `
      <div class="pokemon-card">
        <h3>${data.name.toUpperCase()}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}" />
      </div>
    `;
  } catch (error) {
    console.error(error);
    return `<p>Failed to retrieve data via fetch</p>`;
  }
}

async function getPokemonAxios() {
  return axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=10")
    .then((response) => {
      const results = response.data.results;
      return results
        .map(
          (pokemon, index) => `
          <div class="pokemon-card">
            <h4>${index + 1}. ${pokemon.name}</h4>
          </div>
        `
        )
        .join("");
    })
    .catch((error) => {
      console.error(error);
      return `<p>Failed to retrieve data via axios</p>`;
    });
}

async function updateData() {
  output.innerHTML = "<p>...</p>";

  const [fetchResult, axiosResult] = await Promise.all([
    getPokemonFetch(),
    getPokemonAxios(),
  ]);

  output.innerHTML = `
    <h2>Result Fetch:</h2>
    ${fetchResult}
    <h2>Result Axios:</h2>
    <div class="pokemon-list">${axiosResult}</div>
  `;
}

refreshBtn.addEventListener("click", async () => {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "...";
  await updateData();
  refreshBtn.disabled = false;
  refreshBtn.textContent = "Update data";
});

updateData();

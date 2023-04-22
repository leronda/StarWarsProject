const apiURL = "https://swapi.dev/api/people/";
const characterList = document.querySelector("#characterList");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");

// Переменные для хранения информации о текущей, следующей и предыдущей страницах API
let currentPage = 1;
let nextPage = "";
let prevPage = "";

// Функция для получения списка персонажей с API
async function getCharacters(url) {
  const response = await fetch(url);
  const data = await response.json();
  nextPage = data.next;
  prevPage = data.previous;
  return data.results;
}

// Функция для создания списка персонажей на странице
function renderCharacters(characters) {
  characterList.innerHTML = "";
  characters.forEach((character) => {
    const characterItem = document.createElement("li");
    const characterLink = document.createElement("a");
    characterLink.href = "#";
    characterLink.textContent = character.name;

    // Добавляем обработчик события на ссылку, чтобы отобразить информацию о персонаже
    characterLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const characterInfo = await getCharacterInfo(character.url);
      renderCharacterInfo(characterInfo);
    });
    characterItem.appendChild(characterLink);
    characterList.appendChild(characterItem);
  });
}

// Обработчики событий для кнопок "вперед" и "назад"
nextBtn.addEventListener("click", async () => {
  if (nextPage) {
    currentPage++;
    const characters = await getCharacters(nextPage);
    renderCharacters(characters);
  }
});

prevBtn.addEventListener("click", async () => {
  if (prevPage) {
    currentPage--;
    const characters = await getCharacters(prevPage);
    renderCharacters(characters);
  }
});

// Инициализация страницы
(async function init() {
  const characters = await getCharacters(apiURL);
  renderCharacters(characters);
})();

// Функция для получения информации о персонаже
async function getCharacterInfo(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Функция для отображения информации о персонаже
async function renderCharacterInfo(characterInfo) {
  const table = document.createElement("table");
  const films = await getFilms(characterInfo.films);
  const homeworld = await getPlanet(characterInfo.homeworld);
  const species = await getSpecies(characterInfo.species);

  // Добавляем информацию о персонаже в таблицу
  table.innerHTML = `
    <tr>
      <th colspan="2" style="
    font-family: 'Press Start 2P', cursive;     padding: 20px;
">${characterInfo.name}</th>
    </tr>
      <th>Birth Year</th>
      <td>${
        characterInfo.birth_year ? characterInfo.birth_year : "Not found"
      }</td>
    </tr>
      <th>Gender</th>
      <td>${characterInfo.gender ? characterInfo.gender : "Not found"}</td>
    </tr>
      <th>Films</th>
      <td>${
        films.length > 0
          ? films.map((film) => `<li>${film}</li>`).join("")
          : "No films"
      }</td>
    </tr>
      <th>Homeworld</th>
      <td>${homeworld ? homeworld : "Not found"}</td>
    </tr>
      <th>Species</th>
      <td>${species.length > 0 ? species.join(", ") : "No species"}</td>
    </tr>
    
    `;

  const characterInfoDiv = document.querySelector("#characterInfo");
  characterInfoDiv.innerHTML = "";
  characterInfoDiv.appendChild(table);
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close info card";
  characterInfoDiv.appendChild(closeButton);

  // Обработчик события для кнопки закрытия
  closeButton.addEventListener("click", () => {
    characterInfoDiv.innerHTML = ""; // Очищаем блок информации о персонаже
    characterList.style.display = "flex"; // Показываем список персонажей
  });

  //characterList.style.display = "none"; // Скрываем список персонажей
}

async function getFilms(filmUrls) {
  const filmRequests = filmUrls.map((url) => fetch(url));
  const filmResponses = await Promise.all(filmRequests);
  const filmData = await Promise.all(
    filmResponses.map((response) => response.json())
  );
  return filmData.map((film) => film.title);
}

async function getPlanet(planetUrl) {
  const response = await fetch(planetUrl);
  const planetData = await response.json();
  return planetData.name;
}

async function getSpecies(speciesUrls) {
  const speciesRequests = speciesUrls.map((url) => fetch(url));
  const speciesResponses = await Promise.all(speciesRequests);
  const speciesData = await Promise.all(
    speciesResponses.map((response) => response.json())
  );
  return speciesData.map((species) => species.name);
}

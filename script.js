const maps = [
  {
    name: "Deston",
    file: "Deston.jpeg",
    type: "Llaves y salas",
    filter: ["keys", "secret"],
    description: "Ubicaciones marcadas para security key card, security room y puntos relacionados."
  },
  {
    name: "Erangel",
    file: "Erangel.jpeg",
    type: "Secret rooms",
    filter: ["secret"],
    description: "Mapa con puntos marcados para zonas secretas o sotanos especiales."
  },
  {
    name: "Miramar",
    file: "Miramar.jpeg",
    type: "Llaves secretas",
    filter: ["keys"],
    description: "Guia de ubicaciones marcadas para encontrar llaves secretas en Miramar."
  },
  {
    name: "Paramo",
    file: "Paramo.jpeg",
    type: "Secret rooms",
    filter: ["secret"],
    description: "Ubicaciones de salas secretas indicadas con marcas moradas."
  },
  {
    name: "Rondo",
    file: "Rondo.jpeg",
    type: "Puntos especiales",
    filter: ["special", "secret"],
    description: "Mapa con puntos especiales, vehiculos, garajes y ubicaciones de interes."
  },
  {
    name: "Taego",
    file: "Taego.jpeg",
    type: "Secret rooms",
    filter: ["secret"],
    description: "Ubicaciones de salas secretas en Taego marcadas sobre el mapa."
  },
  {
    name: "Vikendi",
    file: "Vikendi.jpeg",
    type: "Llaves y especiales",
    filter: ["keys", "special", "secret"],
    description: "Referencias para secret keys, research outposts, crowbar rooms y bear cave."
  }
];

const grid = document.querySelector("#mapGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const viewer = document.querySelector("#viewer");
const viewerTitle = document.querySelector("#viewerTitle");
const viewerType = document.querySelector("#viewerType");
const viewerImage = document.querySelector("#viewerImage");
const viewerDescription = document.querySelector("#viewerDescription");
const openImage = document.querySelector("#openImage");
const closeViewer = document.querySelector("#closeViewer");
const previousMap = document.querySelector("#previousMap");
const nextMap = document.querySelector("#nextMap");
const openTiza = document.querySelector("#openTiza");
const playerNames = document.querySelector("#playerNames");
const teamCount = document.querySelector("#teamCount");
const spinTeams = document.querySelector("#spinTeams");
const resetTeams = document.querySelector("#resetTeams");
const teamsBoard = document.querySelector("#teamsBoard");

const defaultPlayers = [
  "AMIL-LAF",
  "1de2",
  "Frantirador9",
  "Ranyet",
  "MrCntral",
  "dio1305",
  "Onixxx",
  "Tom-_-Draag",
  "TIZA_HP"
];

let activeFilter = "all";
let activeIndex = 0;
let visibleMaps = [...maps];

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();

  visibleMaps = maps.filter((map) => {
    const matchesFilter = activeFilter === "all" || map.filter.includes(activeFilter);
    const haystack = `${map.name} ${map.type} ${map.description}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });

  grid.innerHTML = "";

  if (!visibleMaps.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No hay mapas que coincidan con la busqueda.";
    grid.append(empty);
    return;
  }

  visibleMaps.forEach((map, index) => {
    const card = document.createElement("article");
    card.className = "map-card";
    card.innerHTML = `
      <div class="map-thumb">
        <img src="${map.file}" alt="Mapa de ${map.name}" loading="lazy">
        <span class="map-badge">${map.type}</span>
      </div>
      <div class="map-content">
        <div class="map-title-row">
          <div>
            <h2>${map.name}</h2>
            <p class="map-meta">PUBG BATTLEGROUNDS</p>
          </div>
        </div>
        <p class="map-description">${map.description}</p>
        <button class="card-action" type="button" data-index="${index}">Ver mapa</button>
      </div>
    `;
    grid.append(card);
  });
}

function openViewer(index) {
  activeIndex = index;
  const map = visibleMaps[activeIndex];

  viewer.classList.remove("is-art");
  viewerTitle.textContent = map.name;
  viewerType.textContent = map.type;
  viewerDescription.textContent = map.description;
  viewerImage.src = map.file;
  viewerImage.alt = `Mapa de ${map.name}`;
  openImage.href = map.file;

  if (!viewer.open) {
    viewer.showModal();
  }
}

function openTizaViewer() {
  viewer.classList.add("is-art");
  viewerTitle.textContent = "Tiza";
  viewerType.textContent = "Imagen principal";
  viewerDescription.textContent = "Imagen de fondo y portada del sitio.";
  viewerImage.src = "Tiza.png";
  viewerImage.alt = "Imagen principal Tiza";
  openImage.href = "Tiza.png";

  if (!viewer.open) {
    viewer.showModal();
  }
}

function moveViewer(direction) {
  if (!visibleMaps.length) return;
  activeIndex = (activeIndex + direction + visibleMaps.length) % visibleMaps.length;
  openViewer(activeIndex);
}

function getPlayers() {
  return playerNames.value
    .split(/\r?\n|,/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function shufflePlayers(players) {
  const shuffled = [...players];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function clampTeamCount(value) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return 7;
  return Math.min(Math.max(number, 1), 7);
}

function buildTeams(players, count) {
  const teams = Array.from({ length: count }, () => []);

  shufflePlayers(players).forEach((player, index) => {
    teams[index % count].push(player);
  });

  return teams;
}

function renderTeams(teams, highlightIndex = -1) {
  teamsBoard.innerHTML = "";

  teams.forEach((players, index) => {
    const card = document.createElement("article");
    card.className = `team-card${index === highlightIndex ? " is-highlighted" : ""}`;
    const slots = Math.max(players.length, 2);
    const items = Array.from({ length: slots }, (_, slotIndex) => {
      const player = players[slotIndex];
      return `<li class="${player ? "" : "empty-slot"}">${player || "Libre"}</li>`;
    }).join("");

    card.innerHTML = `
      <div class="team-title">
        <span class="team-number">${index + 1}</span>
        <span class="team-name">Team #${index + 1}</span>
      </div>
      <ul class="team-list">${items}</ul>
    `;
    teamsBoard.append(card);
  });
}

function spinTeamRoulette() {
  const players = getPlayers();
  const count = clampTeamCount(teamCount.value);
  teamCount.value = String(count);

  if (!players.length) {
    renderTeams(Array.from({ length: count }, () => []));
    return;
  }

  const teams = buildTeams(players, count);
  let step = 0;
  const maxSteps = count * 3 + 7;
  spinTeams.disabled = true;

  const interval = window.setInterval(() => {
    renderTeams(teams, step % count);
    step += 1;

    if (step > maxSteps) {
      window.clearInterval(interval);
      renderTeams(teams);
      spinTeams.disabled = false;
    }
  }, 90);
}

function resetDefaultTeams() {
  playerNames.value = defaultPlayers.join("\n");
  teamCount.value = "7";
  renderTeams(buildTeams(defaultPlayers, 7));
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  openViewer(Number(button.dataset.index));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeFilter = button.dataset.filter;
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);
openTiza.addEventListener("click", openTizaViewer);
spinTeams.addEventListener("click", spinTeamRoulette);
resetTeams.addEventListener("click", resetDefaultTeams);
teamCount.addEventListener("change", () => {
  const count = clampTeamCount(teamCount.value);
  teamCount.value = String(count);
  renderTeams(buildTeams(getPlayers(), count));
});
playerNames.addEventListener("input", () => {
  renderTeams(buildTeams(getPlayers(), clampTeamCount(teamCount.value)));
});
closeViewer.addEventListener("click", () => viewer.close());
previousMap.addEventListener("click", () => moveViewer(-1));
nextMap.addEventListener("click", () => moveViewer(1));

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    viewer.close();
  }
});

window.addEventListener("keydown", (event) => {
  if (!viewer.open) return;
  if (event.key === "ArrowLeft") moveViewer(-1);
  if (event.key === "ArrowRight") moveViewer(1);
});

renderCards();
renderTeams(buildTeams(defaultPlayers, 7));

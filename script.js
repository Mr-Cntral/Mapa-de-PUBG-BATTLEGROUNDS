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
const mapCount = document.querySelector("#mapCount");

let activeFilter = "all";
let activeIndex = 0;
let visibleMaps = [...maps];

mapCount.textContent = String(maps.length);

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

function moveViewer(direction) {
  if (!visibleMaps.length) return;
  activeIndex = (activeIndex + direction + visibleMaps.length) % visibleMaps.length;
  openViewer(activeIndex);
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

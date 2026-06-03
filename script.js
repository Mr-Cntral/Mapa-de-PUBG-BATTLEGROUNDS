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

const namesArea = document.querySelector("#namesArea");
const teamsCount = document.querySelector("#teamsCount");
const teamsCountTop = document.querySelector("#teamsCountTop");
const modeSelect = document.querySelector("#modeSelect");
const spinShuffleBtn = document.querySelector("#spinShuffleBtn");
const spinBtnCenter = document.querySelector("#spinBtnCenter");
const previewBtn = document.querySelector("#previewBtn");
const restoreBtn = document.querySelector("#restoreBtn");
const clearBtn = document.querySelector("#clearBtn");
const playersStat = document.querySelector("#playersStat");
const teamsStat = document.querySelector("#teamsStat");
const slotsStat = document.querySelector("#slotsStat");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const shuffleLight = document.querySelector("#shuffleLight");
const teamsGrid = document.querySelector("#teamsGrid");
const canvas = document.querySelector("#wheelCanvas");
const ctx = canvas.getContext("2d");
const defaultNames = namesArea.value.trim();

const palette = [
  "#d9a93f",
  "#5ec0ff",
  "#ff6d6d",
  "#9e7cff",
  "#62d88c",
  "#ffa64d",
  "#f75cd0"
];

let teams = [];
let rotation = 0;
let spinning = false;
let shuffleTimer = null;
let audioContext = null;

function getNames() {
  return namesArea.value
    .split(/\r?\n|,/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function getTeamCount() {
  const count = Math.max(2, Math.min(7, Number.parseInt(teamsCount.value, 10) || 7));
  teamsCount.value = String(count);
  teamsCountTop.value = String(count);
  return count;
}

function syncTeamInputs(value) {
  teamsCount.value = value;
  teamsCountTop.value = value;
  createEmptyTeams();
  drawWheel();
}

function shuffle(items) {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}

function createEmptyTeams() {
  const count = getTeamCount();
  teams = Array.from({ length: count }, (_, index) => ({
    id: index,
    number: index + 1,
    name: `Team #${index + 1}`,
    color: palette[index % palette.length],
    members: []
  }));
  renderTeams(false);
  updateStats();
}

function makeDistribution() {
  const names = shuffle(getNames());
  const count = getTeamCount();

  const generated = Array.from({ length: count }, (_, index) => ({
    id: index,
    number: index + 1,
    name: `Team #${index + 1}`,
    color: palette[index % palette.length],
    members: []
  }));

  if (modeSelect.value === "balanced") {
    names.forEach((name, index) => {
      generated[index % count].members.push(name);
    });
  } else {
    names.forEach((name) => {
      generated[Math.floor(Math.random() * count)].members.push(name);
    });
  }

  return generated;
}

function renderTeams(isShuffling) {
  teamsGrid.innerHTML = "";

  const maxRows = Math.max(
    2,
    ...teams.map((team) => team.members.length),
    Math.ceil(getNames().length / Math.max(1, getTeamCount()))
  );

  teams.forEach((team) => {
    const card = document.createElement("article");
    card.className = `roulette-team-card${isShuffling ? " shuffling" : ""}`;

    const rows = Array.from({ length: maxRows }, (_, index) => {
      const player = team.members[index];
      return `<div class="roulette-player-row${isShuffling ? " flip" : ""}${player ? "" : " empty"}">${player || "Libre"}</div>`;
    }).join("");

    card.innerHTML = `
      <div class="roulette-team-head">
        <div class="roulette-team-number" style="background:${shade(team.color, -28)}">${team.number}</div>
        <div class="roulette-team-title" style="background:${lighten(team.color, 68)}">${team.name}</div>
      </div>
      <div>${rows}</div>
    `;
    teamsGrid.append(card);
  });
}

function updateStats() {
  const playerCount = getNames().length;
  const teamCount = getTeamCount();
  playersStat.textContent = String(playerCount);
  teamsStat.textContent = String(teamCount);
  slotsStat.textContent = String(Math.max(playerCount, teamCount * 2));
}

function previewShuffle() {
  if (spinning) return;
  teams = makeDistribution();
  renderTeams(false);
  updateStats();
  drawWheel();
  resultTitle.textContent = "Vista rapida generada";
  resultText.textContent = "Los nombres ya fueron mezclados. Presiona Girar para verlo con animacion.";
}

function spinAndShuffle() {
  if (spinning) return;

  if (!getNames().length) {
    resultTitle.textContent = "No hay jugadores";
    resultText.textContent = "Agrega nombres en la lista para poder sortear.";
    return;
  }

  spinning = true;
  ensureAudio();
  setButtons(false);
  shuffleLight.classList.add("show");
  resultTitle.textContent = "Mezclando...";
  resultText.textContent = "Los nombres estan cambiando entre todos los equipos.";

  const finalTeams = makeDistribution();

  window.clearInterval(shuffleTimer);
  shuffleTimer = window.setInterval(() => {
    teams = makeDistribution();
    renderTeams(true);
  }, 115);

  spinWheelAnimation(() => {
    window.clearInterval(shuffleTimer);
    shuffleTimer = null;

    teams = finalTeams;
    renderTeams(false);
    drawWheel();

    resultTitle.textContent = "Equipos sorteados";
    resultText.textContent = makeSummary(teams);

    shuffleLight.classList.remove("show");
    spinning = false;
    setButtons(true);
    updateStats();
  });
}

function makeSummary(list) {
  return list
    .map((team) => `${team.name}: ${team.members.length ? team.members.join(", ") : "Libre"}`)
    .join(" | ");
}

function setButtons(enabled) {
  spinShuffleBtn.disabled = !enabled;
  spinBtnCenter.disabled = !enabled;
  previewBtn.disabled = !enabled;
  restoreBtn.disabled = !enabled;
  clearBtn.disabled = !enabled;
  teamsCount.disabled = !enabled;
  teamsCountTop.disabled = !enabled;
  modeSelect.disabled = !enabled;
}

function spinWheelAnimation(done) {
  const start = rotation;
  const extraTurns = Math.PI * 2 * (6 + Math.floor(Math.random() * 3));
  const randomStop = Math.random() * Math.PI * 2;
  const end = start + extraTurns + randomStop;
  const duration = 4200;
  const startTime = performance.now();
  let nextTickAt = startTime;

  function animate(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    rotation = start + (end - start) * eased;
    drawWheel();

    if (now >= nextTickAt && progress < 0.98) {
      playTick(progress);
      nextTickAt = now + 42 + progress * progress * 210;
    }

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    } else {
      rotation = normalize(end);
      drawWheel();
      playFinishSound();
      done();
    }
  }

  window.requestAnimationFrame(animate);
}

function ensureAudio() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({ frequency, duration, type = "square", volume = 0.04, when = 0 }) {
  const context = ensureAudio();
  if (!context) return;

  const start = context.currentTime + when;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playTick(progress) {
  const frequency = 760 - progress * 220;
  const duration = 0.028 + progress * 0.018;
  playTone({ frequency, duration, type: "square", volume: 0.035 });
}

function playFinishSound() {
  playTone({ frequency: 440, duration: 0.11, type: "triangle", volume: 0.055 });
  playTone({ frequency: 660, duration: 0.14, type: "triangle", volume: 0.05, when: 0.1 });
  playTone({ frequency: 880, duration: 0.18, type: "sine", volume: 0.045, when: 0.22 });
}

function drawWheel() {
  const count = getTeamCount();
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = width * 0.43;
  const innerRadius = width * 0.16;
  const rimRadius = width * 0.47;
  const slice = (Math.PI * 2) / count;

  ctx.clearRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, rimRadius + 45);
  aura.addColorStop(0, "rgba(255,255,255,.12)");
  aura.addColorStop(0.62, "rgba(216,173,76,.08)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(centerX, centerY, rimRadius + 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);

  for (let index = 0; index < count; index += 1) {
    const color = palette[index % palette.length];
    const start = -Math.PI / 2 + index * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, start + 0.01, end - 0.01);
    ctx.arc(centerX, centerY, innerRadius, end - 0.01, start + 0.01, true);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX - 110, centerY - 130, innerRadius, centerX, centerY, outerRadius);
    gradient.addColorStop(0, lighten(color, 30));
    gradient.addColorStop(0.55, color);
    gradient.addColorStop(1, shade(color, -22));
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,255,255,.14)";
    ctx.stroke();

    const middle = start + slice / 2;
    const textX = centerX + Math.cos(middle) * (innerRadius + (outerRadius - innerRadius) * 0.56);
    const textY = centerY + Math.sin(middle) * (innerRadius + (outerRadius - innerRadius) * 0.56);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(middle);
    if (Math.cos(middle) < 0) ctx.rotate(Math.PI);

    const title = `Team #${index + 1}`;
    const maxWidth = (outerRadius - innerRadius) * 0.72;
    const titleSize = fitText(title, maxWidth, count <= 4 ? 40 : 28, 16);

    ctx.font = `900 ${titleSize}px Inter, Segoe UI, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(4, titleSize * 0.13);
    ctx.strokeStyle = "rgba(0,0,0,.58)";
    ctx.strokeText(title, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillText(title, 0, 0);

    ctx.restore();
  }

  ctx.restore();

  drawRim(centerX, centerY, rimRadius, outerRadius);
  drawCenter(centerX, centerY, innerRadius);
}

function drawRim(centerX, centerY, rimRadius, outerRadius) {
  const ring = ctx.createRadialGradient(centerX - 80, centerY - 90, outerRadius, centerX, centerY, rimRadius + 15);
  ring.addColorStop(0, "#f3dca0");
  ring.addColorStop(0.3, "#d3a24a");
  ring.addColorStop(0.58, "#78582a");
  ring.addColorStop(0.82, "#1b1f27");
  ring.addColorStop(1, "#f7c35c");

  ctx.beginPath();
  ctx.arc(centerX, centerY, rimRadius, 0, Math.PI * 2);
  ctx.lineWidth = 28;
  ctx.strokeStyle = ring;
  ctx.stroke();

  for (let index = 0; index < 14; index += 1) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / 14;
    const x = centerX + Math.cos(angle) * rimRadius;
    const y = centerY + Math.sin(angle) * rimRadius;
    const color = palette[index % palette.length];

    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = lighten(color, 35);
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.beginPath();
    ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCenter(centerX, centerY, innerRadius) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius + 18, 0, Math.PI * 2);
  ctx.fillStyle = "#d1a247";
  ctx.shadowColor = "rgba(0,0,0,.35)";
  ctx.shadowBlur = 18;
  ctx.fill();

  ctx.shadowBlur = 0;
  const metal = ctx.createRadialGradient(centerX - 55, centerY - 65, 12, centerX, centerY, innerRadius + 8);
  metal.addColorStop(0, "#fff");
  metal.addColorStop(0.3, "#e7edf4");
  metal.addColorStop(0.6, "#9ea9b8");
  metal.addColorStop(1, "#5b6673");

  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius + 3, 0, Math.PI * 2);
  ctx.fillStyle = metal;
  ctx.fill();
}

function normalize(angle) {
  const two = Math.PI * 2;
  return ((angle % two) + two) % two;
}

function fitText(text, maxWidth, start, minimum) {
  let size = start;
  ctx.font = `900 ${size}px Inter, Segoe UI, Arial`;

  while (ctx.measureText(text).width > maxWidth && size > minimum) {
    size -= 1;
    ctx.font = `900 ${size}px Inter, Segoe UI, Arial`;
  }

  return size;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function lighten(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + ((255 - r) * percent) / 100, g + ((255 - g) * percent) / 100, b + ((255 - b) * percent) / 100);
}

function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 + percent / 100), g * (1 + percent / 100), b * (1 + percent / 100));
}

function restoreNames() {
  namesArea.value = defaultNames;
  teamsCount.value = "7";
  teamsCountTop.value = "7";
  modeSelect.value = "balanced";
  createEmptyTeams();
  drawWheel();
  resultTitle.textContent = "Listo para mezclar";
  resultText.textContent = "Presiona Girar y los nombres se moveran entre equipos al mismo tiempo.";
}

function clearTeams() {
  window.clearInterval(shuffleTimer);
  shuffleTimer = null;
  createEmptyTeams();
  resultTitle.textContent = "Equipos limpiados";
  resultText.textContent = "Los nombres siguen en la lista. Presiona Girar para sortearlos nuevamente.";
  shuffleLight.classList.remove("show");
}

teamsCount.addEventListener("input", () => syncTeamInputs(teamsCount.value));
teamsCountTop.addEventListener("input", () => syncTeamInputs(teamsCountTop.value));
spinShuffleBtn.addEventListener("click", spinAndShuffle);
spinBtnCenter.addEventListener("click", spinAndShuffle);
previewBtn.addEventListener("click", previewShuffle);
restoreBtn.addEventListener("click", restoreNames);
clearBtn.addEventListener("click", clearTeams);
namesArea.addEventListener("input", updateStats);
modeSelect.addEventListener("change", updateStats);
window.addEventListener("resize", drawWheel);

renderCards();
createEmptyTeams();
drawWheel();
updateStats();

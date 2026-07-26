// WRITE YOUR JS CODE HERE
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const dataSection = this.dataset.section;
    navLinks.forEach(function (item) {
      item.classList.remove("bg-blue-500/10", "text-blue-400");
      item.classList.add("text-slate-300", "hover:bg-slate-800");
    });
    this.classList.add("bg-blue-500/10", "text-blue-400");
    this.classList.remove("text-slate-300", "hover:bg-slate-800");
    sections.forEach((section) => section.classList.add("hidden"));
    document.querySelector(`section[data-section="${dataSection}"]`).classList.remove("hidden");
  });
});
/*----------------- section today in space -----------------*/
const apiKey = "9fBYFM8ZQweLfUg2NchlWsOwWzNE3c1twqeFS1tt";
const apodUrl = "https://api.nasa.gov/planetary/apod";

const apodImage = document.querySelector("#apod-image");
const apodTitle = document.querySelector("#apod-title");
const apodExplanation = document.querySelector("#apod-explanation");
const apodDate = document.querySelector("#apod-date");

const apodDateDetail = document.querySelector("#apod-date-detail");
const apodDateInfo = document.querySelector("#apod-date-info");
const apodMediaType = document.querySelector("#apod-media-type");
const apodCopyright = document.querySelector("#apod-copyright");
const loadDateBtn = document.querySelector("#load-date-btn");
const todayApodBtn = document.querySelector("#today-apod-btn");
const apodDateInput = document.querySelector("#apod-date-input");
const dataInputWrapperSpan = document.querySelector(".date-input-wrapper span");
const apodImageContainer = document.querySelector("#apod-image-container");
const apodLoading = document.querySelector("#apod-loading");
const viewBtn = document.querySelector("#apod-image-container button");
let fullImageUrl = "";
function displayApod(data) {
  const formatDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  apodDateInput.value = data.date;
dataInputWrapperSpan.textContent = formatDate;
  apodTitle.textContent = data.title;
  apodExplanation.textContent = data.explanation;
  apodDate.textContent = `Astronomy Picture of the Day - ${formatDate}`;
  apodDateDetail.innerHTML = `
    <i class="far fa-calendar mr-2"></i>${formatDate}
  `;
  apodDateInfo.textContent = formatDate;
  apodMediaType.textContent =
    data.media_type === "image" ? "Image" : "Video";
    apodCopyright.textContent = `© ${data.copyright}`;
  const oldVideo = document.querySelector("#apod-video");
if (oldVideo) {
  oldVideo.remove();
}
if (data.media_type === "image") {
  apodImage.style.display = "block";
  apodImage.src = data.url;
  fullImageUrl = data.hdurl || data.url;
  apodImage.alt = data.title;
} else {
  apodImage.style.display = "none";

  apodImageContainer.insertAdjacentHTML(
    "beforeend",
    `
    <iframe
      id="apod-video"
      src="${data.url}"
      class="w-full h-full"
      frameborder="0"
      allowfullscreen>
    </iframe>
    `
  );
}
}
viewBtn.addEventListener("click", function () {
  window.open(fullImageUrl, "_blank");
});
apodDateInput.addEventListener("change", function () {
  const formattedDate = new Date(this.value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  dataInputWrapperSpan.textContent = formattedDate;
});
async function getApod(date = "") {
  try {
    let url = `${apodUrl}?api_key=${apiKey}`;
    if (date) {
      url += `&date=${date}`;
    }
apodImage.classList.add("hidden");
apodImage.src = "";
    apodLoading.classList.remove("hidden");
    let response = await fetch(url);
if (!response.ok && date) {
  response = await fetch(`${apodUrl}?api_key=${apiKey}`);
}
if (!response.ok) {
  throw new Error("Failed to fetch APOD");
}
const data = await response.json();
    displayApod(data);
apodImage.onload = function () {
  apodLoading.classList.add("hidden");
  apodImage.classList.remove("hidden");
};
  } catch (error) {
  apodLoading.classList.add("hidden");
  apodImage.src = "./assets/images/placeholder.webp";
  apodImage.classList.remove("hidden");
  apodTitle.textContent = "Failed to load image";
  apodExplanation.textContent =
    "Something went wrong while fetching data from NASA. Please try again later.";
  apodDate.textContent = "Astronomy Picture of the Day";
  apodDateDetail.textContent = "-";
  apodDateInfo.textContent = "-";
  apodMediaType.textContent = "-";
  apodCopyright.textContent = "© NASA";
  console.error(error);
}


}
const today = new Date().toISOString().split("T")[0];
apodDateInput.value = today;
getApod(today);
apodDateInput.min = "1995-06-16";
apodDateInput.max = new Date().toISOString().split("T")[0];
todayApodBtn.addEventListener("click", function () {
  const today = new Date().toISOString().split("T")[0];
  apodDateInput.value = today;
  dataInputWrapperSpan.textContent = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  getApod(today);
});
loadDateBtn.addEventListener("click", function () {
  const selectedDate = apodDateInput.value;
  getApod(selectedDate);
});
apodImage.onerror = function () {
    apodLoading.classList.remove("hidden");
    apodImage.src = "./assets/images/placeholder.webp";
    apodImage.classList.add("hidden");
};
/*----------------- end section today in space -----------------*/
/*----------------- section Launches -----------------*/
const featuredLaunch = document.querySelector("#featured-launch");
const launchesGrid = document.querySelector("#launches-grid");
const launchesUrl = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10";
  function getDaysUntilLaunch(date) {
  const today = new Date();
  const launchDate = new Date(date);
  const diff = launchDate - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}
function getCountdown(date) {
  const now = new Date();
  const launchDate = new Date(date);
  const diff = launchDate - now;
  if (diff <= 0) {
    return {
      value: "Launched",
      label: "Mission Started",
    };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return {
      value: days,
      label: days === 1 ? "Day Until Launch" : "Days Until Launch",
    };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return {
      value: hours,
      label: hours === 1 ? "Hour Until Launch" : "Hours Until Launch",
    };
  }
  const minutes = Math.floor(diff / (1000 * 60));
  return {
    value: minutes,
    label: minutes === 1 ? "Minute Until Launch" : "Minutes Until Launch",
  };
}
    function getStatusColor(status) {
  if (status === "Go" || status === "Success") {
    return "bg-green-500/90";
  } else if (status === "TBD" || status === "TBC") {
    return "bg-blue-500/90";
  } else if (status === "Hold") {
    return "bg-yellow-500/90";
  } else {
    return "bg-red-500/90";
  }
}
async function getUpcomingLaunches() {
  try {
    const response = await fetch(launchesUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch launches");
    }
    const data = await response.json();
    const launches = data.results;
displayFeaturedLaunch(launches[0]);
displayLaunches(launches.slice(1));
function displayFeaturedLaunch(launch) {
    const daysUntilLaunch = getDaysUntilLaunch(launch.net);
    const dayText = daysUntilLaunch === 1 ? "Day" : "Days";
const countdown = getCountdown(launch.net);
  featuredLaunch.innerHTML = `
            <!-- STATIC FEATURED LAUNCH -->
            <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                                Go
                            </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${launch.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${launch.launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${launch.rocket.configuration.full_name.split(" Block")[0]}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">
  ${daysUntilLaunch}
</p>
<p class="text-xs text-slate-400">
  ${dayText} Until Launch
</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">
                        ${new Date(launch.net).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        })}
                        </p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">
                        ${new Date(launch.net).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                        })} UTC
                        </p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">
                        ${launch.pad.location.name}
                        </p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${launch.pad.location.country?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${launch.mission?.description?.slice(0,180) || "No description available."}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <img
  src="${launch.image?.image_url || "./assets/images/launch-placeholder.png"}"
  alt="${launch.name}"
  class="w-full h-full object-cover"
/>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
  `;
}
function displayLaunches(launches) {
  launchesGrid.innerHTML = "";
  launches.forEach((launch) => {
    launchesGrid.innerHTML += `
      <div
        class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
      >
        <div
          class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden"
        >
          <img
            src="${launch.image?.image_url || "./assets/images/launch-placeholder.png"}"
            alt="${launch.name}"
            class="launch-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onerror="this.onerror=null;this.src='./assets/images/launch-placeholder.png';"
          >
          <div class="absolute top-3 right-3">
            <span
              class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
            >
              TBD
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4
              class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
            >
              ${launch.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider.name}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">
                ${new Date(launch.net).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">
                ${new Date(launch.net).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })} UTC
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">
                ${launch.rocket.configuration.full_name}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">
                ${launch.pad.location.name}
              </span>
            </div>
          </div>
          <div
            class="flex items-center gap-2 pt-4 border-t border-slate-700"
          >
            <button
              class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
            >
              Details
            </button>
            <button
              class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}
  } catch (error) {
    console.error(error);
  }
}
getUpcomingLaunches();
/*----------------- end section Launches -----------------*/
/*----------------- section Planets -----------------*/
const planetImage = document.querySelector("#planet-detail-image");
const planetName = document.querySelector("#planet-detail-name");
const planetDescription = document.querySelector("#planet-detail-description");
const planetTemp = document.querySelector("#planet-temp");
const planetRadius = document.querySelector("#planet-radius");
const planetMass = document.querySelector("#planet-mass");
const planetDistance = document.querySelector("#planet-distance");
const planetOrbit = document.querySelector("#planet-orbital-period");
const planetMoons = document.querySelector("#planet-moons");
const planetGravity = document.querySelector("#planet-gravity");

const planetDiscoverer = document.querySelector("#planet-discoverer");
const planetDiscoveryDate = document.querySelector("#planet-discovery-date");
const planetBodyType = document.querySelector("#planet-body-type");
const planetVolume = document.querySelector("#planet-volume");
const planetFacts = document.querySelector("#planet-facts");
const planetPerihelion = document.querySelector("#planet-perihelion");
const planetAphelion = document.querySelector("#planet-aphelion");
const planetEccentricity = document.querySelector("#planet-eccentricity");
const planetInclination = document.querySelector("#planet-inclination");
const planetAxialTilt = document.querySelector("#planet-axial-tilt");
const planetEscape = document.querySelector("#planet-escape");
const planetImages = {
  mercury: "./assets/images/mercury.png",
  venus: "./assets/images/venus.png",
  earth: "./assets/images/earth.png",
  mars: "./assets/images/mars.png",
  jupiter: "./assets/images/jupiter.png",
  saturn: "./assets/images/saturn.png",
  uranus: "./assets/images/uranus.png",
  neptune: "./assets/images/neptune.png",
};
const planetColors = {
  mercury: "#eab308",
  venus: "#f97316",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#facc15",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};
function getPlanetType(name) {
  if (["jupiter", "saturn"].includes(name)) return "Gas Giant";
  if (["uranus", "neptune"].includes(name)) return "Ice Giant";
  return "Terrestrial";
}
function getPlanetTypeStyle(name) {
  if (["jupiter", "saturn"].includes(name)) {
    return {
      type: "Gas Giant",
      bg: "#a855f780",
      color: "#c084fc",
    };
  }
  if (["uranus", "neptune"].includes(name)) {
    return {
      type: "Ice Giant",
      bg: "#3b82f680",
      color: "#60a5fa",
    };
  }
  return {
    type: "Terrestrial",
    bg: "#f9731680",
    color: "#fb923c",
  };
}
function getPlanetFacts(name) {
  const facts = {
    earth: [
      "Only known planet with liquid water",
      "Atmosphere contains 78% nitrogen",
      "Magnetic field protects from solar wind",
      "Formed 4.54 billion years ago"
    ],
    mars: [
      "Known as the Red Planet",
      "Has the largest volcano in the solar system",
      "Has two moons",
      "Possible evidence of ancient water"
    ],
    jupiter: [
      "Largest planet in the solar system",
      "Has the Great Red Spot",
      "Mostly hydrogen and helium",
      "Has many moons"
    ],
    saturn: [
      "Famous for its rings",
      "Second largest planet",
      "Has many icy moons",
      "A gas giant planet"
    ]
  };
  return facts[name] || [
    "Part of our solar system",
    "A fascinating celestial body",
    "Orbits around the Sun",
    "Studied by astronomers"
  ];
}
function getDistance(planet) {
  return (planet.semimajorAxis / 149597870.7).toFixed(2);
}
function getOrbit(planet) {
  return planet.sideralOrbit > 365
    ? `${(planet.sideralOrbit / 365.25).toFixed(1)} Years`
    : `${planet.sideralOrbit.toFixed(0)} Days`;
}
function displayPlanetDetails(planet) {
const name = planet.englishName.toLowerCase();
planetDiscoverer.textContent =
  planet.discoveredBy || "Known since antiquity";
planetDiscoveryDate.textContent =
  planet.discoveryDate || "Ancient";
planetBodyType.textContent =
  getPlanetType(name);
planetVolume.textContent =
  planet.vol ? `${planet.vol.volValue} km³` : "Unknown";
planetPerihelion.textContent =
  planet.perihelion
    ? `${(planet.perihelion / 1000000).toFixed(1)}M km`
    : "Unknown";
planetAphelion.textContent =
  planet.aphelion
    ? `${(planet.aphelion / 1000000).toFixed(1)}M km`
    : "Unknown";
planetEccentricity.textContent =
  planet.eccentricity || "Unknown";
planetInclination.textContent =
  planet.inclination
    ? `${planet.inclination}°`
    : "Unknown";
planetAxialTilt.textContent =
  planet.axialTilt
    ? `${planet.axialTilt}°`
    : "Unknown";
planetEscape.textContent =
  planet.escape
    ? `${planet.escape} km/s`
    : "Unknown";
    planetFacts.innerHTML = "";
getPlanetFacts(name).forEach(fact => {
  planetFacts.innerHTML += `
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">
        ${fact}
      </span>
    </li>
  `;
});
  planetImage.src = planetImages[name];
  planetImage.alt = planet.englishName;
  planetName.textContent = planet.englishName;
planetDescription.textContent =
`${planet.englishName} is one of the planets in our solar system.`;
  planetGravity.textContent = `${planet.gravity} m/s²`;
  planetMass.textContent =
    `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;
planetRadius.textContent =
`${planet.meanRadius.toLocaleString()} km`;
planetDistance.textContent = `${getDistance(planet)} AU`;
planetOrbit.textContent = getOrbit(planet);
  planetTemp.textContent =
    planet.avgTemp ? `${planet.avgTemp} K` : "Unknown";
  planetMoons.textContent =
    planet.moons ? planet.moons.length : 0;
}
const planetsUrl =
  "https://solar-system-opendata-proxy.vercel.app/api/planets";
const planetsGrid = document.querySelector("#planets-grid");
const comparisonTable = document.querySelector("#planet-comparison-tbody");
let planets = [];
async function getPlanets() {
  try {
    const response = await fetch(planetsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch planets");
    }
    const data = await response.json();
    planets = data.bodies.filter((planet) => planet.isPlanet);
    displayPlanets();
displayComparisonTable();
const earth = planets.find(
  planet => planet.englishName.toLowerCase() === "earth"
);
if (earth) {
  displayPlanetDetails(earth);
  document
    .querySelector(`[data-planet-id="${earth.id}"]`)
    ?.classList.add("border-blue-500", "bg-blue-500/10");
}
  } catch (error) {
    console.error(error);
    planetsGrid.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-red-400 text-xl">
          Failed to load planets
        </p>
      </div>
    `;
  }
}
getPlanets();
planetsGrid.addEventListener("click", function (e) {
  const card = e.target.closest(".planet-card");
  if (!card) return;
  document.querySelectorAll(".planet-card").forEach((item) => {
    item.classList.remove("border-blue-500", "bg-blue-500/10");
  });
  card.classList.add("border-blue-500", "bg-blue-500/10");
  const id = card.dataset.planetId;
  const selectedPlanet = planets.find(
  planet => planet.englishName.toLowerCase() === id
);
  displayPlanetDetails(selectedPlanet);
});
function displayPlanets() {
  planetsGrid.innerHTML = "";
  planets.forEach((planet) => {
    const name = planet.englishName.toLowerCase();
const color = planetColors[name] || "#64748b";
const image = planetImages[name] || "";
    planetsGrid.innerHTML += `
      <div
        class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
        data-planet-id="${name}"
        onmouseover="this.style.borderColor='${color}80'"
    onmouseout="this.style.borderColor='#334155'"
      >
        <div class="relative mb-3 h-24 flex items-center justify-center">
          <img
            src="${image}"
            alt="${planet.englishName}"
            class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
          >
        </div>
        <h4 class="font-semibold text-center text-sm">
          ${planet.englishName}
        </h4>
        <p class="text-xs text-slate-400 text-center">
          ${getDistance(planet)} AU
        </p>
      </div>
    `;
  });
}
function displayComparisonTable() {
  comparisonTable.innerHTML = "";
  const earth = planets.find(
    (planet) => planet.englishName.toLowerCase() === "earth"
  );
if (!earth) return;
  const earthMass =
    earth.mass.massValue * Math.pow(10, earth.mass.massExponent);
  planets.forEach((planet) => {
    const name = planet.englishName.toLowerCase();
const distance = getDistance(planet);
const orbit = getOrbit(planet);
    const diameter = (planet.meanRadius * 2).toFixed(0);
    const mass =
      (
        (planet.mass.massValue *
          Math.pow(10, planet.mass.massExponent)) /
        earthMass
      ).toFixed(3);
    const moons = planet.moons ? planet.moons.length : 0;
    const typeInfo = getPlanetTypeStyle(name);
    comparisonTable.innerHTML += `
      <tr class="${
        name === "earth"
          ? "bg-blue-500/5 hover:bg-slate-800/30"
          : "hover:bg-slate-800/30"
      } transition-colors">
        <td class="px-6 py-4 sticky left-0 bg-slate-800">
          ${planet.englishName}
        </td>
        <td class="px-6 py-4">
          ${getDistance(planet)}
        </td>
        <td class="px-6 py-4">
          ${Number(diameter).toLocaleString()}
        </td>
        <td class="px-6 py-4">
          ${mass}
        </td>
        <td class="px-6 py-4">
          ${getOrbit(planet)}
        </td>
        <td class="px-6 py-4">
          ${moons}
        </td>
        <td class="px-6 py-4">
          <span
            class="px-2 py-1 rounded text-xs"
            style="background:${typeInfo.bg};color:${typeInfo.color}"
          >
            ${typeInfo.type}
          </span>
        </td>
      </tr>
    `;
  });
}
/*----------------- end section Planets -----------------*/
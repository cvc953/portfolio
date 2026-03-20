// Global state for dynamic data
let projects = [];
let experience = [];

// Experience translations (inline for simplicity)
const experienceData = {
  es: [
    {
      role: "Desarrollo de aplicaciones mobile",
      period: "2025 - Presente",
      summary:
        "Construcción de aplicaciones en Flutter y Android enfocadas en rendimiento, manejo de datos locales y experiencia de usuario. Trabajo con reproducción multimedia, organización de información y consumo de APIs externas.",
    },
    {
      role: "Arquitectura y diseño de software",
      period: "Enfoque actual",
      summary:
        "Estructuración de aplicaciones con enfoque modular, separación de responsabilidades y control del estado en interfaces reactivas.",
    },
    {
      role: "Procesamiento de datos y multimedia",
      period: "Especialización",
      summary:
        "Trabajo con archivos locales, metadatos y sincronización de contenido (letras, audio), optimizando rendimiento en dispositivos móviles.",
    },
  ],
  en: [
    {
      role: "Mobile application development",
      period: "2025 - Present",
      summary:
        "Building Flutter and Android applications focused on performance, local data handling and user experience. Working with multimedia playback, information organization and external API consumption.",
    },
    {
      role: "Software architecture and design",
      period: "Current focus",
      summary:
        "Structuring applications with modular approach, separation of concerns and state management in reactive interfaces.",
    },
    {
      role: "Data and multimedia processing",
      period: "Specialization",
      summary:
        "Working with local files, metadata and content synchronization (lyrics, audio), optimizing performance on mobile devices.",
    },
  ],
};

// DOM references
const projectGrid = document.getElementById("project-grid");
const timeline = document.getElementById("timeline");

/**
 * Get the correct path to data files (works for both / and /en/)
 */
function getDataPath() {
  // If we're in /en/ subdirectory, go up one level
  if (window.location.pathname.startsWith('/en')) {
    return '../data/projects.json';
  }
  return 'data/projects.json';
}

/**
 * Load projects from JSON and set experience data based on current language
 */
async function loadData() {
  try {
    const dataPath = getDataPath();
    const response = await fetch(dataPath);
    const data = await response.json();
    const lang = i18n.getLanguage();

    projects = data[lang].projects;
    experience = experienceData[lang];
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

/**
 * Create a pill/tag element
 */
const createTag = (text) => {
  const tag = document.createElement("span");
  tag.className = "pill";
  tag.textContent = text;
  return tag;
};

/**
 * Create a project card element
 */
const createProjectCard = (project) => {
  const card = document.createElement("article");
  card.className = "card project-card";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const desc = document.createElement("p");
  desc.className = "muted";
  desc.textContent = project.description;

  // Impact statement (if present)
  if (project.impact) {
    const impact = document.createElement("p");
    impact.className = "impact";
    impact.textContent = project.impact;
    card.appendChild(impact);
  }

  const meta = document.createElement("div");
  meta.className = "project-meta";
  meta.innerHTML = `<span>${project.year}</span><span>•</span><span>${project.role}</span>`;

  const tags = document.createElement("div");
  tags.className = "pill-row";
  project.tags.forEach((tag) => tags.appendChild(createTag(tag)));

  const links = document.createElement("div");
  links.className = "project-links";
  project.links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "ghost";
    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.target = link.url.startsWith("http") ? "_blank" : "_self";
    anchor.rel = "noreferrer";
    links.appendChild(anchor);
  });

  card.append(title, desc, meta, tags, links);
  return card;
};

/**
 * Create a timeline item element
 */
const createTimelineItem = (item) => {
  const wrapper = document.createElement("article");
  wrapper.className = "timeline-item";

  const role = document.createElement("h3");
  role.textContent = item.role;

  const period = document.createElement("span");
  period.className = "muted";
  period.textContent = item.period;

  const summary = document.createElement("p");
  summary.textContent = item.summary;

  wrapper.append(role, period, summary);
  return wrapper;
};

/**
 * Render projects to the grid
 */
const renderProjects = () => {
  if (projectGrid) {
    projectGrid.innerHTML = "";
    projects.forEach((project) =>
      projectGrid.appendChild(createProjectCard(project))
    );
  }
};

/**
 * Render experience timeline
 */
const renderTimeline = () => {
  if (timeline) {
    timeline.innerHTML = "";
    experience.forEach((item) =>
      timeline.appendChild(createTimelineItem(item))
    );
  }
};

// Hero title translations (with HTML for accent spans)
const heroTitleData = {
  es: 'Construyendo apps móviles <span class="accent">rápidas</span> y <span class="accent">funcionales</span>.',
  en: 'Building <span class="accent">fast</span> and <span class="accent">functional</span> mobile apps.'
};

/**
 * Update hero title with HTML (preserves accent spans)
 */
function updateHeroTitle() {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.innerHTML = heroTitleData[i18n.getLanguage()];
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize i18n module first
  i18n.init();

  // Update hero title (needs innerHTML for accent spans)
  updateHeroTitle();

  // Load data from JSON
  await loadData();

  // Render dynamic content
  renderProjects();
  renderTimeline();
});

// Listen for language changes to re-render dynamic content
window.addEventListener("i18n:languageChanged", async (event) => {
  // Force update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = i18n.t(key);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Update hero title (with HTML)
  updateHeroTitle();

  // Reload data with new language
  await loadData();

  // Re-render dynamic content
  renderProjects();
  renderTimeline();
});

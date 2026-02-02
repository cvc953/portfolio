const projects = [
    {
        title: "Avas Eto",
        description: "App de gestión de tareas en Flutter con autenticación y tema oscuro.",
        tags: ["Flutter", "Dart", "SQLite"],
        year: "2025",
        role: "Autor",
        links: [
            { label: "Repositorio", url: "https://github.com/cvc953/avas-eto" },
        ],
    },
    {
        title: "TimeLyr",
        description: "Buscador de letras para música local con metadatos y soporte LRC.",
        tags: ["Flutter", "Dart", "LRCLib"],
        year: "2025",
        role: "Autor",
        links: [
            { label: "Repositorio", url: "https://github.com/cvc953/TimeLyr" },
        ],
    },
    {
        title: "EduProjects",
        description: "Plataforma full-stack de gestión educativa con Flutter y FastAPI para cursos, tareas y calificaciones.",
        tags: ["Flutter", "FastAPI", "Docker"],
        year: "2025",
        role: "Autor",
        links: [
            { label: "Repositorio", url: "https://github.com/cvc953/EduProjects" },
        ],
    },
    {
        title: "Local Player",
        description: "Reproductor de música local en Android con Jetpack Compose.",
        tags: ["Kotlin", "Android", "Compose"],
        year: "2026",
        role: "Autor",
        links: [
            { label: "Repositorio", url: "https://github.com/cvc953/localplayer" },
        ],
    },
    {
        title: "Monochrome (fork)",
        description: "Versión Android del cliente de streaming musical Monochrome.",
        tags: ["Android", "JavaScript", "Fork"],
        year: "2026",
        role: "Colaborador",
        links: [
            { label: "Repositorio", url: "https://github.com/cvc953/monochrome" },
        ],
    },
];

const experience = [
    {
        role: "Avas Eto · Proyecto personal",
        period: "2025 - Presente",
        summary: "App Flutter para gestión de tareas con autenticación y persistencia local.",
    },
    {
        role: "TimeLyr · Proyecto personal",
        period: "2025 - Presente",
        summary: "App móvil que analiza música local y obtiene letras sincronizadas vía LRCLib.",
    },
    {
        role: "Local Player · Proyecto personal",
        period: "2025 - Presente",
        summary: "Reproductor de música local en Android con Jetpack Compose.",
    },
    {
        role: "EduProjects · Proyecto personal",
        period: "2025 - Presente",
        summary: "Plataforma full-stack de gestión educativa con Flutter y FastAPI para administración de cursos, tareas y calificaciones.",
    },
    {
        role: "Monochrome (fork) · Colaboración",
        period: "2026",
        summary: "Aportes a la versión Android de Monochrome, cliente de streaming musical.",
    },
];

const projectGrid = document.getElementById("project-grid");
const timeline = document.getElementById("timeline");

const createTag = (text) => {
    const tag = document.createElement("span");
    tag.className = "pill";
    tag.textContent = text;
    return tag;
};

const createProjectCard = (project) => {
    const card = document.createElement("article");
    card.className = "card project-card";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = project.description;

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

if (projectGrid) {
    projects.forEach((project) => projectGrid.appendChild(createProjectCard(project)));
}

if (timeline) {
    experience.forEach((item) => timeline.appendChild(createTimelineItem(item)));
}

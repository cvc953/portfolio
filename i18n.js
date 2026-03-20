/**
 * i18n.js — Internationalization module for Cristian's Portfolio
 * Handles language detection, storage, and translation lookup
 * 
 * Features:
 * - Browser language detection (navigator.language parsing)
 * - localStorage persistence (key: "preferred-lang")
 * - Cross-tab synchronization via StorageEvent API
 * - History API integration for SEO-friendly URLs (/en/)
 * - DOM updates via data-i18n attribute convention
 */

const i18n = (() => {
  // ============================================================
  // PRIVATE STATE
  // ============================================================
  
  let currentLang = 'es';
  const STORAGE_KEY = 'preferred-lang';
  const SUPPORTED_LANGS = ['es', 'en'];

  // ============================================================
  // INLINED TRANSLATIONS
  // Avoids fetch for faster init and simpler deployment
  // ============================================================
  
  const esTranslations = {
    "nav": {
      "about": "Sobre mí",
      "projects": "Proyectos",
      "experience": "Experiencia",
      "contact": "Contacto",
      "cta": "Hablemos"
    },
    "hero": {
      "eyebrow": "Portafolio 2026",
      "title": "Construyendo apps móviles rápidas y funcionales.",
      "subtitle": "Diseño y desarrollo productos que resuelven problemas reales, con foco en desempeño, accesibilidad y una estética cuidada.",
      "ctaProjects": "Ver proyectos",
      "ctaContact": "Disponibilidad",
      "cardLabel": "Rol actual",
      "cardRole": "Desarrollador Mobile",
      "cardDescription": "Buscando roles donde pueda aportar en desarrollo mobile y arquitectura de aplicaciones.",
      "pills": ["Flutter", "Android (Kotlin)", "Backend (Python)", "APIs REST"]
    },
    "about": {
      "eyebrow": "Perfil",
      "title": "Sobre mí",
      "description": "Soy desarrollador mobile con experiencia en Flutter y Android nativo. Me enfoco en crear apps que no solo funcionan bien, sino que también se sienten bien — interfaces responsivas, transiciones fluidas y datos que se muestran cuando el usuario los necesita.\n\nMi fortaleza está en la intersección entre la lógica de negocio y la experiencia de usuario. No me conformo con 'funciona', busco 'funciona de una manera que tiene sentido'.",
      "strengthsTitle": "Fortalezas",
      "strength1": "Manejo de estado en apps complejas.",
      "strength2": "Procesamiento de datos locales (audio, metadatos).",
      "strength3": "Integración de APIs externas (LRCLib, etc.).",
      "strength4": "Construcción de UIs reactivas con Compose/Flutter.",
      "techTitle": "Tecnologías clave"
    },
    "projects": {
      "eyebrow": "Selección",
      "title": "Proyectos destacados",
      "viewRepository": "Ver repositorio",
      "viewProject": "Ver proyecto"
    },
    "experience": {
      "eyebrow": "Trayectoria",
      "title": "Experiencia técnica"
    },
    "contact": {
      "eyebrow": "Contacto",
      "title": "¿Hablamos?",
      "description": "Cuéntame sobre tu proyecto, rol o idea. Respondo en 24h.",
      "preferencesTitle": "Preferencias",
      "pref1": "Proyectos entre 2-6 meses.",
      "pref2": "Equipos distribuidos o híbridos.",
      "pref3": "Foco en shipping continuo y ownership compartido."
    },
    "footer": {
      "copyright": "© 2026 · Cristian Villalobos Cuadrado",
      "tagline": "Diseñado con cariño y café."
    },
    "languages": {
      "es": "Español",
      "en": "English"
    }
  };

  const enTranslations = {
    "nav": {
      "about": "About me",
      "projects": "Projects",
      "experience": "Experience",
      "contact": "Contact",
      "cta": "Let's talk"
    },
    "hero": {
      "eyebrow": "Portfolio 2026",
      "title": "Building fast and functional mobile apps.",
      "subtitle": "I design and develop products that solve real problems, with focus on performance, accessibility, and polished aesthetics.",
      "ctaProjects": "View projects",
      "ctaContact": "Availability",
      "cardLabel": "Current role",
      "cardRole": "Mobile Developer",
      "cardDescription": "Looking for roles where I can contribute to mobile development and application architecture.",
      "pills": ["Flutter", "Android (Kotlin)", "Backend (Python)", "REST APIs"]
    },
    "about": {
      "eyebrow": "Profile",
      "title": "About me",
      "description": "I'm a mobile developer with experience in Flutter and native Android. I focus on creating apps that not only work well but also feel good — responsive interfaces, smooth transitions, and data that displays when the user needs it.\n\nMy strength lies at the intersection of business logic and user experience. I don't settle for 'it works', I aim for 'it works in a way that makes sense'.",
      "strengthsTitle": "Strengths",
      "strength1": "State management in complex apps.",
      "strength2": "Local data processing (audio, metadata).",
      "strength3": "External API integration (LRCLib, etc.).",
      "strength4": "Building reactive UIs with Compose/Flutter.",
      "techTitle": "Key Technologies"
    },
    "projects": {
      "eyebrow": "Selection",
      "title": "Featured Projects",
      "viewRepository": "View repository",
      "viewProject": "View project"
    },
    "experience": {
      "eyebrow": "Background",
      "title": "Technical Experience"
    },
    "contact": {
      "eyebrow": "Contact",
      "title": "Let's talk?",
      "description": "Tell me about your project, role or idea. I respond within 24h.",
      "preferencesTitle": "Preferences",
      "pref1": "Projects between 2-6 months.",
      "pref2": "Distributed or hybrid teams.",
      "pref3": "Focus on continuous shipping and shared ownership."
    },
    "footer": {
      "copyright": "© 2026 · Cristian Villalobos Cuadrado",
      "tagline": "Made with love and coffee."
    },
    "languages": {
      "es": "Español",
      "en": "English"
    }
  };

  const translations = { es: esTranslations, en: enTranslations };

  // ============================================================
  // PRIVATE FUNCTIONS
  // ============================================================

  /**
   * Parse browser language and return supported lang code
   * @returns {'es' | 'en'}
   */
  function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || '';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (SUPPORTED_LANGS.includes(langCode)) {
      return langCode;
    }
    return 'es'; // Default to Spanish
  }

  /**
   * Get translation for a dot-notation key
   * @param {string} key - Dot notation key (e.g., "hero.title")
   * @returns {string}
   */
  function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return ''; // Graceful fallback
      }
    }
    
    return typeof value === 'string' ? value : '';
  }

  /**
   * Update all elements with data-i18n attribute
   */
  function updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getTranslation(key);
      if (translation) {
        el.textContent = translation;
      }
    });
  }

  /**
   * Update language toggle button states
   */
  function updateToggleButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ============================================================
  // CROSS-TAB SYNCHRONIZATION
  // Listen for storage changes from other tabs
  // ============================================================
  
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      if (SUPPORTED_LANGS.includes(event.newValue)) {
        currentLang = event.newValue;
        updateDOM();
        updateToggleButtons();
        document.documentElement.lang = currentLang;
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('i18n:languageChanged', { 
          detail: { language: currentLang } 
        }));
      }
    }
  });

  // ============================================================
  // PUBLIC API
  // ============================================================
  
  return {
    /**
     * Initialize the i18n module
     * Call this on DOMContentLoaded
     * @returns {string} The detected/resolved language code
     */
    init() {
      // Check localStorage first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        currentLang = stored;
      } else {
        // Detect from browser
        currentLang = detectLanguage();
      }
      
      // Update DOM with current language
      this.updateUI();
      
      return currentLang;
    },

    /**
     * Get translation for a key
     * @param {string} key - Dot notation key (e.g., "hero.title")
     * @returns {string} Translation string or empty string if not found
     */
    t(key) {
      return getTranslation(key);
    },

    /**
     * Set the current language
     * @param {string} lang - 'es' or 'en'
     * @param {boolean} [updateURL=true] - Whether to update URL via History API
     */
    setLanguage(lang, updateURL = true) {
      if (!SUPPORTED_LANGS.includes(lang)) {
        console.warn(`i18n: unsupported language "${lang}", defaulting to "es"`);
        lang = 'es';
      }
      
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      
      // Update URL if requested (for /en/ support)
      if (updateURL) {
        if (lang === 'en') {
          // Redirect to /en/ for SEO-friendly URLs
          if (!window.location.pathname.startsWith('/en')) {
            window.history.pushState({}, '', '/en/');
          }
        } else {
          // Go back to root
          if (window.location.pathname.startsWith('/en')) {
            window.history.pushState({}, '', '/');
          }
        }
      }
      
      this.updateUI();
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('i18n:languageChanged', { 
        detail: { language: lang } 
      }));
    },

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
      return currentLang;
    },

    /**
     * Detect language from browser
     * @returns {string} Detected language code ('es' or 'en')
     */
    detectLanguage() {
      return detectLanguage();
    },

    /**
     * Update all UI elements with current translations
     */
    updateUI() {
      updateDOM();
      updateToggleButtons();
      document.documentElement.lang = currentLang;
    },

    /**
     * Get all translations for current language (for data like arrays)
     * @returns {object} Translation object for current language
     */
    getAllTranslations() {
      return translations[currentLang];
    },

    /**
     * Check if a language is supported
     * @param {string} lang - Language code to check
     * @returns {boolean}
     */
    isSupported(lang) {
      return SUPPORTED_LANGS.includes(lang);
    },

    /**
     * Get list of supported languages
     * @returns {string[]} Array of supported language codes
     */
    getSupportedLanguages() {
      return [...SUPPORTED_LANGS];
    }
  };
})();

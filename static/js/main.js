// ============================================================
// Portfolio Ndawa Mohammed — interactions
// ============================================================

// --- État du typing effect (module level) ---
let typingTimeout = null;
let typingTexts = [];
let typingTextIndex = 0;
let typingCharIndex = 0;
let typingIsDeleting = false;
let typingEl = null;

// --- Traductions FR / EN ---
const translations = {
    fr: {
        'nav.home':           'accueil',
        'nav.about':          'à propos',
        'nav.projects':       'projets',
        'nav.contact':        'contact',
        'hero.subtitle':      "Je conçois des applications web, des modules ODOO et des outils desktop avec une obsession pour la qualité du code et la justesse des décisions techniques.",
        'hero.stat.exp':      'années',
        'hero.stat.tech':     'technos',
        'section.featured':   'sélection',
        'section.featured.sub': "Une sélection courte. Le reste vit dans /projets.",
        'section.skills':     'stack',
        'section.skills.sub': "Les outils que j'utilise au quotidien, classés par usage réel.",
        'about.title':        'À propos de moi',
        'about.subtitle':     'Développeur Python & ODOO basé à Douala, Cameroun.',
        'about.bio':          "Je construis des outils Python qui résolvent de vrais problèmes : modules ODOO sur mesure, applications web Django, logiciels desktop. Trois ans à livrer du code pour des entreprises camerounaises — pas d'effets de mode, juste du logiciel qui tient en production.",
        'exp.title':          'Expérience professionnelle',
        'edu.title':          'Formation',
        'exp.present':        'NOW',
        'skills.title':       '// compétences techniques',
        'projects.title':     'Mes projets',
        'projects.subtitle':  "Une sélection de réalisations. Filtrez par techno pour cibler.",
        'projects.filter.all':'all',
        'projects.view':      'voir le projet',
        'projects.empty':     "Ajoutez des projets depuis l'interface d'administration.",
        'contact.title':      'Restons en contact',
        'contact.subtitle':   'Pour une collaboration, une question technique ou simplement dire bonjour.',
        'contact.form.title': '// nouveau message',
        'contact.send':       'send-message',
        'contact.location':   'loc',
        'contact.phone':      'tel',
        'contact.name':       '--name',
        'contact.email':      '--email',
        'contact.subject':    '--subject',
        'contact.message':    '--message',
        'project.back':       '← cd ../projets',
        'project.tech':       'technologies',
        'project.github':     'github',
        'project.live':       'voir en ligne',
    },
    en: {
        'nav.home':           'home',
        'nav.about':          'about',
        'nav.projects':       'projects',
        'nav.contact':        'contact',
        'hero.subtitle':      'I build web applications, ODOO modules and desktop tools with an obsession for code quality and well-thought technical decisions.',
        'hero.stat.exp':      'years',
        'hero.stat.tech':     'stacks',
        'section.featured':   'selection',
        'section.featured.sub': 'A short selection. The rest lives in /projects.',
        'section.skills':     'stack',
        'section.skills.sub': 'The tools I use day to day, grouped by real-world usage.',
        'about.title':        'About me',
        'about.subtitle':     'Python & ODOO Developer based in Douala, Cameroon.',
        'about.bio':          "I build Python tools that solve real problems: custom ODOO modules, Django web apps, desktop software. Three years shipping code for Cameroonian companies — no buzzwords, just software that holds up in production.",
        'exp.title':          'Work Experience',
        'edu.title':          'Education',
        'exp.present':        'NOW',
        'skills.title':       '// technical skills',
        'projects.title':     'My projects',
        'projects.subtitle':  'A selection of my work. Filter by tech to narrow down.',
        'projects.filter.all':'all',
        'projects.view':      'view project',
        'projects.empty':     'Add projects from the admin interface.',
        'contact.title':      "Let's get in touch",
        'contact.subtitle':   'For a collaboration, a technical question or just to say hi.',
        'contact.form.title': '// new message',
        'contact.send':       'send-message',
        'contact.location':   'loc',
        'contact.phone':      'tel',
        'contact.name':       '--name',
        'contact.email':      '--email',
        'contact.subject':    '--subject',
        'contact.message':    '--message',
        'project.back':       '← cd ../projects',
        'project.tech':       'technologies',
        'project.github':     'github',
        'project.live':       'view live',
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initI18n();
    initNavbarScroll();
    initMobileMenu();
    initScrollReveal();
    initSkillBars();
    initTypingEffect();
    initToasts();
    initProjectFilter();
});

// ============================================================
// Thème dark / light
// ============================================================
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('light');
            const next = isLight ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }
}

function applyTheme(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    if (theme === 'light') {
        document.documentElement.classList.add('light');
        icons.forEach(i => i.className = 'fas fa-moon theme-icon');
    } else {
        document.documentElement.classList.remove('light');
        icons.forEach(i => i.className = 'fas fa-sun theme-icon');
    }
}

// ============================================================
// i18n FR / EN
// ============================================================
function initI18n() {
    const saved = localStorage.getItem('lang') || 'fr';
    applyLang(saved);

    document.querySelectorAll('#lang-toggle, .lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.lang === 'en' ? 'en' : 'fr';
            const next = current === 'fr' ? 'en' : 'fr';
            localStorage.setItem('lang', next);
            applyLang(next);
        });
    });
}

function applyLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-label').forEach(el => {
        el.textContent = lang === 'fr' ? 'EN' : 'FR';
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.placeholder = translations[lang][key];
        }
    });

    // Relance le typing avec les textes de la bonne langue
    const tEl = document.getElementById('typing-text');
    if (tEl) {
        const textsKey = 'typing' + lang.charAt(0).toUpperCase() + lang.slice(1);
        try {
            const texts = JSON.parse(tEl.dataset[textsKey] || '[]');
            if (texts.length) restartTyping(texts);
        } catch (e) { /* ignore */ }
    }
}

// ============================================================
// Navbar scroll effect
// ============================================================
function initNavbarScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

// ============================================================
// Menu mobile plein écran
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    const close = document.getElementById('mobile-close');
    if (!toggle || !menu) return;

    function open() {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function shut() {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        menu.classList.contains('open') ? shut() : open();
    });
    if (close) close.addEventListener('click', shut);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) shut();
    });
}

// ============================================================
// Scroll reveal — apparitions à l'arrivée dans le viewport
// ============================================================
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ============================================================
// Skill bars animées
// ============================================================
function initSkillBars() {
    const bars = document.querySelectorAll('.bar-fill, .skill-bar-fill');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
        bars.forEach(b => b.style.width = (b.dataset.width || 0) + '%');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => { bar.style.width = (bar.dataset.width || 0) + '%'; }, 150);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
}

// ============================================================
// Typing effect
// ============================================================
function initTypingEffect() {
    typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    const lang = localStorage.getItem('lang') || 'fr';
    const textsKey = 'typing' + lang.charAt(0).toUpperCase() + lang.slice(1);
    try {
        typingTexts = JSON.parse(typingEl.dataset[textsKey] || '[]');
    } catch (e) { typingTexts = []; }

    if (typingTexts.length) typeLoop();
}

function restartTyping(newTexts) {
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTexts = newTexts;
    typingTextIndex = 0;
    typingCharIndex = 0;
    typingIsDeleting = false;
    if (typingEl) { typingEl.textContent = ''; typeLoop(); }
}

function typeLoop() {
    if (!typingEl || !typingTexts.length) return;
    const current = typingTexts[typingTextIndex];
    let speed = 70;

    if (typingIsDeleting) {
        typingEl.textContent = current.substring(0, typingCharIndex - 1);
        typingCharIndex--;
        speed = 35;
    } else {
        typingEl.textContent = current.substring(0, typingCharIndex + 1);
        typingCharIndex++;
        speed = 70;
    }

    if (!typingIsDeleting && typingCharIndex === current.length) {
        speed = 1800;
        typingIsDeleting = true;
    } else if (typingIsDeleting && typingCharIndex === 0) {
        typingIsDeleting = false;
        typingTextIndex = (typingTextIndex + 1) % typingTexts.length;
        speed = 400;
    }

    typingTimeout = setTimeout(typeLoop, speed);
}

// ============================================================
// Toasts (messages Django)
// ============================================================
function initToasts() {
    const container = document.getElementById('toasts');
    if (!container) return;
    setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease';
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 500);
    }, 5000);
}

// ============================================================
// Filtres projets par technologie
// ============================================================
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = (btn.dataset.filter || '').toLowerCase();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const techs = (card.dataset.techs || '').toLowerCase();
                const match = filter === 'all' || techs.split(',').map(t => t.trim()).includes(filter);
                card.style.display = match ? '' : 'none';
            });
        });
    });
}

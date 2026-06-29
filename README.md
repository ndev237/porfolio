# Portfolio — Eclador Vynil Ndawa Djeutcha

Site portfolio personnel développé avec **Django 5** et **Tailwind CSS** (CDN).
Design premium glassmorphism, mode sombre/clair, interface bilingue Français/Anglais.

---

## Table des matières

1. [Aperçu du projet](#1-aperçu-du-projet)
2. [Stack technique](#2-stack-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Installation et démarrage](#4-installation-et-démarrage)
5. [Architecture Django](#5-architecture-django)
   - [Modèles de données](#51-modèles-de-données)
   - [Vues](#52-vues)
   - [URLs](#53-urls)
   - [Formulaires](#54-formulaires)
   - [Admin](#55-admin)
6. [Templates HTML](#6-templates-html)
7. [Frontend : CSS & JavaScript](#7-frontend--css--javascript)
   - [style.css](#71-stylecss)
   - [main.js](#72-mainjs)
8. [Fonctionnalités avancées](#8-fonctionnalités-avancées)
   - [Mode sombre / Mode clair](#81-mode-sombre--mode-clair)
   - [Traduction FR / EN](#82-traduction-fr--en)
9. [Base de données et fixtures](#9-base-de-données-et-fixtures)
10. [Administration du contenu](#10-administration-du-contenu)
11. [Déploiement en production](#11-déploiement-en-production)
12. [Référence des variables de contexte](#12-référence-des-variables-de-contexte)
13. [Ajout de contenu](#13-ajout-de-contenu)
14. [Personnalisation du thème](#14-personnalisation-du-thème)

---

## 1. Aperçu du projet

Ce portfolio est un site web dynamique piloté par une base de données Django.
Tout le contenu (compétences, projets, expériences, formations) est géré via l'interface d'administration Django, sans modifier le code source.

**Pages disponibles :**

| URL              | Nom Django        | Description                                      |
|-----------------|-------------------|--------------------------------------------------|
| `/`             | `home`            | Accueil : hero, stats, projets mis en avant, compétences |
| `/about/`       | `about`           | CV complet : profil, compétences, expériences, formations |
| `/projects/`    | `projects`        | Grille de tous les projets avec filtre par technologie |
| `/projects/<slug>/` | `project_detail` | Détail complet d'un projet                   |
| `/contact/`     | `contact`         | Formulaire de contact + informations de contact  |
| `/admin/`       | —                 | Interface d'administration Django                |

---

## 2. Stack technique

| Composant        | Technologie                          | Version    |
|-----------------|--------------------------------------|------------|
| Backend          | Django                               | ≥ 5.0      |
| Base de données  | SQLite (développement)               | —          |
| CSS              | Tailwind CSS (CDN) + CSS custom      | Play CDN   |
| Icônes           | Font Awesome                         | 6.5.1      |
| Polices          | Inter (Google Fonts)                 | —          |
| Hot reload       | django-browser-reload                | ≥ 1.12.0   |
| JavaScript       | Vanilla JS (aucun framework)         | ES2020+    |

---

## 3. Structure du projet

```
porfolio/
│
├── config/                     # Configuration Django
│   ├── settings.py             # Paramètres : BDD, apps, templates, media
│   ├── urls.py                 # Routes principales + media en dev
│   ├── wsgi.py                 # Point d'entrée WSGI (production)
│   └── asgi.py                 # Point d'entrée ASGI (async)
│
├── core/                       # Application principale
│   ├── migrations/             # Fichiers de migration (générés)
│   ├── fixtures/
│   │   └── initial_data.json   # Données initiales (CV complet)
│   ├── models.py               # Modèles : Skill, Project, Experience, Education, ContactMessage
│   ├── views.py                # Vues : home, about, projects, project_detail, contact
│   ├── urls.py                 # Routes de l'application core
│   ├── forms.py                # ContactForm (ModelForm)
│   ├── admin.py                # Configuration interface admin
│   ├── apps.py                 # Configuration de l'app
│   └── tests.py                # Fichier de tests (à compléter)
│
├── templates/                  # Templates HTML (héritent de base.html)
│   ├── base.html               # Layout principal (navbar, footer, toggles)
│   ├── home.html               # Page d'accueil
│   ├── about.html              # Page À propos / CV
│   ├── projects.html           # Liste des projets
│   ├── project_detail.html     # Détail d'un projet
│   └── contact.html            # Page de contact
│
├── static/
│   ├── css/
│   │   └── style.css           # Styles custom + variables + mode clair
│   ├── js/
│   │   └── main.js             # JS : thème, i18n, animations, filtres
│   └── images/                 # Images statiques (à placer ici)
│
├── media/                      # Fichiers uploadés (images de projets)
├── manage.py                   # CLI Django
└── requirements.txt            # Dépendances Python
```

---

## 4. Installation et démarrage

### Prérequis

- Python 3.10+
- pip

### Étapes

```bash
# 1. Cloner / accéder au projet
cd porfolio

# 2. Créer et activer un environnement virtuel
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
.venv\Scripts\activate           # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# 5. Charger les données initiales (CV complet)
python manage.py loaddata core/fixtures/initial_data.json

# 6. Créer un super-utilisateur pour l'admin
python manage.py createsuperuser

# 7. Lancer le serveur de développement
python manage.py runserver
```

Le site est accessible à : `http://127.0.0.1:8000/`
L'admin est accessible à : `http://127.0.0.1:8000/admin/`

---

## 5. Architecture Django

### 5.1 Modèles de données

Fichier : `core/models.py`

#### `Skill` — Compétences techniques

| Champ      | Type                  | Description                              |
|-----------|-----------------------|------------------------------------------|
| `name`    | CharField(100)        | Nom de la compétence (ex : Python)       |
| `icon`    | CharField(100)        | Classe Font Awesome (ex : `fab fa-python`) |
| `category`| CharField (choices)   | `frontend`, `backend`, `devops`, `tools`, `other` |
| `level`   | IntegerField          | Niveau de 0 à 100 (affiché en barre de progression) |
| `order`   | IntegerField          | Ordre d'affichage                        |

#### `Project` — Projets du portfolio

| Champ               | Type            | Description                                    |
|--------------------|-----------------|------------------------------------------------|
| `title`            | CharField(200)  | Titre du projet                                |
| `slug`             | SlugField       | Identifiant URL unique (auto-généré en admin) |
| `description`      | TextField       | Description complète                           |
| `short_description`| CharField(300)  | Résumé affiché sur les cartes                 |
| `image`            | ImageField      | Capture d'écran / illustration (optionnel)    |
| `technologies`     | CharField(500)  | Technologies séparées par virgules            |
| `github_url`       | URLField        | Lien vers le dépôt GitHub                     |
| `live_url`         | URLField        | Lien vers le site en production               |
| `featured`         | BooleanField    | Mis en avant sur la page d'accueil            |
| `order`            | IntegerField    | Ordre d'affichage                              |
| `created_at`       | DateTimeField   | Date de création (auto)                        |

**Méthode utile :**
```python
project.tech_list()
# Retourne : ['Python', 'Django', 'ODOO 17']
# Depuis : "Python,Django, ODOO 17"
```

#### `Experience` — Expérience professionnelle

| Champ         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `position`   | CharField(200) | Intitulé du poste                             |
| `company`    | CharField(200) | Nom de l'entreprise                           |
| `location`   | CharField(200) | Ville / pays                                  |
| `start_date` | DateField      | Date de début                                 |
| `end_date`   | DateField      | Date de fin (null si poste actuel)            |
| `is_current` | BooleanField   | Poste en cours → affiche "Présent"            |
| `description`| TextField      | Description des missions                      |
| `order`      | IntegerField   | Ordre d'affichage dans la timeline            |

#### `Education` — Formation académique

| Champ         | Type           | Description                                   |
|--------------|----------------|-----------------------------------------------|
| `degree`     | CharField(200) | Intitulé du diplôme / certification           |
| `school`     | CharField(200) | Établissement                                 |
| `location`   | CharField(200) | Localisation                                  |
| `start_date` | DateField      | Année de début                                |
| `end_date`   | DateField      | Année de fin (null si en cours)               |
| `is_current` | BooleanField   | Formation en cours → affiche "En cours"       |
| `description`| TextField      | Description / session (optionnel)             |
| `order`      | IntegerField   | Ordre d'affichage                             |

#### `ContactMessage` — Messages reçus

| Champ        | Type           | Description                                   |
|-------------|----------------|-----------------------------------------------|
| `name`      | CharField(200) | Nom de l'expéditeur                           |
| `email`     | EmailField     | Email de contact                              |
| `subject`   | CharField(300) | Sujet du message                              |
| `message`   | TextField      | Corps du message                              |
| `created_at`| DateTimeField  | Date de réception (auto)                      |
| `is_read`   | BooleanField   | Marqué comme lu depuis l'admin                |

---

### 5.2 Vues

Fichier : `core/views.py`

```python
def home(request)
```
- Requêtes : `Project.objects.filter(featured=True)[:3]` + `Skill.objects.all()`
- Template : `home.html`
- Contexte : `featured_projects`, `skills`

---

```python
def about(request)
```
- Requêtes : `Skill.objects.all()` + `Experience.objects.all()` + `Education.objects.all()`
- Template : `about.html`
- Contexte : `skills`, `experiences`, `educations`

---

```python
def projects(request)
```
- Requêtes : `Project.objects.all()`
- Calcule `all_techs` : liste triée des technologies uniques de tous les projets
- Template : `projects.html`
- Contexte : `projects`, `all_techs`

---

```python
def project_detail(request, slug)
```
- Requête : `get_object_or_404(Project, slug=slug)`
- Template : `project_detail.html`
- Contexte : `project`

---

```python
def contact(request)
```
- GET : affiche le formulaire vide
- POST : valide et enregistre le `ContactMessage`, redirige avec message de succès
- Template : `contact.html`
- Contexte : `form`

---

### 5.3 URLs

**`config/urls.py`** — Routes principales :

```python
path('admin/',      admin.site.urls)
path('__reload__/', include('django_browser_reload.urls'))   # hot reload dev
path('',            include('core.urls'))
```

**`core/urls.py`** — Routes de l'application :

```python
path('',                          views.home,           name='home')
path('about/',                    views.about,          name='about')
path('projects/',                 views.projects,       name='projects')
path('projects/<slug:slug>/',     views.project_detail, name='project_detail')
path('contact/',                  views.contact,        name='contact')
```

**Utilisation dans les templates :**
```html
<a href="{% url 'home' %}">Accueil</a>
<a href="{% url 'project_detail' project.slug %}">Voir</a>
```

---

### 5.4 Formulaires

Fichier : `core/forms.py`

```python
class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
```

Les widgets sont stylisés avec les classes Tailwind CSS glassmorphism.
Les messages d'erreur de validation sont affichés sous chaque champ dans `contact.html`.

---

### 5.5 Admin

Fichier : `core/admin.py`

| Modèle            | Fonctionnalités admin clés                                           |
|------------------|-----------------------------------------------------------------------|
| `SkillAdmin`     | Édition rapide de `order` et `level` directement dans la liste       |
| `ProjectAdmin`   | Slug auto-généré depuis le titre, édition rapide de `featured`/`order` |
| `ExperienceAdmin`| Édition rapide de `order`, filtre par `is_current`                   |
| `EducationAdmin` | Édition rapide de `order`                                            |
| `ContactMessageAdmin` | Champs en lecture seule, édition rapide de `is_read`           |

Accès : `http://127.0.0.1:8000/admin/`

---

## 6. Templates HTML

Tous les templates héritent de `base.html` via `{% extends 'base.html' %}`.

### `base.html`

Fournit :
- **Navbar** fixe avec logo EVN, liens de navigation, bouton langue (FR/EN), bouton thème (🌙/☀️)
- **Menu mobile** (slide-in) avec les mêmes contrôles
- **Fond animé** : blobs gradient flottants + grille de points
- **Messages Django** : affichage auto-dismiss (disparaît après 4,5 s)
- **Footer** : copyright, liens sociaux (email, téléphone, GitHub, LinkedIn)
- Chargement de Tailwind CDN, Font Awesome, `style.css`, `main.js`

**Blocs disponibles pour les pages enfants :**

```html
{% block title %}...{% endblock %}        <!-- Titre de l'onglet -->
{% block extra_head %}...{% endblock %}   <!-- CSS/meta supplémentaires -->
{% block content %}...{% endblock %}      <!-- Contenu principal -->
{% block extra_scripts %}...{% endblock %}<!-- Scripts supplémentaires -->
```

### `home.html`

Structure :
1. **Hero** — Nom, animation de frappe (titres qui s'écrivent/effacent), boutons CTA
2. **Stats** — Compteurs (3+ ans, 5+ projets, 10+ technologies)
3. **Projets mis en avant** — Grille de cartes (max 3, `featured=True`)
4. **Compétences** — Grille d'icônes avec barres de progression (10 premières)
5. **CTA** — Carte d'invitation au contact

### `about.html`

Structure :
1. **Carte profil** (sticky) — Avatar, infos de contact, langues, loisirs, qualités
2. **Bio** — Présentation personnelle
3. **Compétences** — Groupées par catégorie avec barres de progression
4. **Timeline expérience** — Poste actuel avec badge "En poste"
5. **Timeline formation** — Formation actuelle avec badge "En cours"

### `projects.html`

Structure :
1. **Filtres** — Boutons générés depuis `all_techs` (filtre JS côté client)
2. **Grille de projets** — Cartes avec image/placeholder, tags, liens GitHub/demo
3. **État vide** — Message si aucun projet en base

### `project_detail.html`

Structure :
1. Lien retour
2. Image de couverture avec overlay
3. Titre, description courte, tags de technologies
4. Boutons GitHub / site en ligne
5. Description complète
6. Liste des technologies avec icônes check
7. Métadonnées (date, lien repo)

### `contact.html`

Structure :
1. **Colonne gauche** (2/5) — Cartes info (email, téléphone, adresse), badge disponibilité, réseaux sociaux
2. **Colonne droite** (3/5) — Formulaire de contact avec validation

---

## 7. Frontend : CSS & JavaScript

### 7.1 `style.css`

Fichier : `static/css/style.css`

#### Variables CSS

```css
:root {
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-accent:  linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --gradient-dark:    linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%);
    --glass-bg:         rgba(255, 255, 255, 0.05);
    --glass-border:     rgba(255, 255, 255, 0.1);
    --glass-shadow:     0 8px 32px rgba(0, 0, 0, 0.3);
}
```

#### Classes utilitaires principales

| Classe              | Effet                                                  |
|--------------------|--------------------------------------------------------|
| `.glass-card`      | Carte glassmorphism (blur + border translucide)        |
| `.gradient-text`   | Texte dégradé indigo → violet                          |
| `.gradient-text-accent` | Texte dégradé rose → rouge                       |
| `.gradient-bg`     | Fond dégradé primaire                                  |
| `.btn-primary`     | Bouton dégradé plein avec ombre                        |
| `.btn-outline`     | Bouton contour translucide                             |
| `.nav-link`        | Lien de navigation avec underline animé                |
| `.skill-bar-bg`    | Conteneur de barre de progression                      |
| `.skill-bar-fill`  | Remplissage animé (width via `data-width` en JS)       |
| `.timeline`        | Conteneur de timeline avec ligne verticale             |
| `.timeline-item`   | Élément de timeline avec point                         |
| `.tech-tag`        | Badge technologie arrondi                              |
| `.social-link`     | Bouton réseau social carré arrondi                     |
| `.reveal`          | Animation d'apparition au scroll (IntersectionObserver)|
| `.theme-toggle-btn`| Bouton de bascule thème                                |
| `.lang-toggle-btn` | Bouton de bascule langue                               |
| `.filter-btn`      | Bouton de filtre pour les projets                      |

#### Mode clair — `html.light`

L'ajout de la classe `light` sur `<html>` déclenche un thème clair complet :

```css
html.light body          { background: linear-gradient(135deg, #eef2ff …); color: #1e293b; }
html.light .glass-card   { background: rgba(255,255,255,0.75); … }
html.light .navbar       { background: rgba(248,250,255,0.88); … }
/* + overrides Tailwind pour text-white, text-gray-400, bg-white/5… */
```

---

### 7.2 `main.js`

Fichier : `static/js/main.js`

#### Initialisation

```javascript
document.addEventListener('DOMContentLoaded', () => {
    initTheme();       // Applique le thème sauvegardé
    initI18n();        // Applique la langue sauvegardée
    initNavbar();      // Effet scroll sur la navbar
    initMobileMenu();  // Menu burger mobile
    initScrollReveal();// Animations d'apparition
    initSkillBars();   // Animation des barres de compétences
    initTypingEffect();// Effet machine à écrire (hero)
    initMessages();    // Auto-dismiss des messages Django
    initProjectFilter();// Filtre JS des projets par technologie
});
```

#### Dictionnaire de traductions

```javascript
const translations = {
    fr: {
        'nav.home':          'Accueil',
        'nav.about':         'À propos',
        'hero.greeting':     'Bonjour, je suis',
        'exp.present':       'Présent',
        // ... ~50 clés
    },
    en: {
        'nav.home':          'Home',
        'nav.about':         'About',
        'hero.greeting':     "Hello, I'm",
        'exp.present':       'Present',
        // ... ~50 clés
    }
};
```

#### Fonction d'application de la langue

```javascript
function applyLang(lang) {
    document.documentElement.lang = lang;

    // Met à jour tous les éléments [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    // Met à jour les placeholders [data-i18n-ph]
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.placeholder = translations[lang][el.getAttribute('data-i18n-ph')];
    });

    // Redémarre l'animation de frappe dans la bonne langue
    const tEl = document.getElementById('typing-text');
    const texts = JSON.parse(tEl.dataset['typing' + lang.charAt(0).toUpperCase() + lang.slice(1)]);
    restartTyping(texts);
}
```

#### Effet machine à écrire

```javascript
// Variables globales pour permettre le redémarrage lors du changement de langue
let typingTexts = [];
let typingTextIndex = 0;
let typingCharIndex = 0;
let typingIsDeleting = false;
let typingTimeout = null;

// Données dans le HTML :
// data-typing-fr='["Développeur Python","Développeur ODOO",…]'
// data-typing-en='["Python Developer","ODOO Developer",…]'
```

---

## 8. Fonctionnalités avancées

### 8.1 Mode sombre / Mode clair

**Persistance** : `localStorage.getItem('theme')` → `'dark'` ou `'light'` (défaut : `'dark'`)

**Fonctionnement :**

1. Au chargement de la page, un script inline dans `<head>` applique immédiatement la classe sans flash :
   ```html
   <script>
       if (localStorage.getItem('theme') === 'light')
           document.documentElement.classList.add('light');
   </script>
   ```

2. Au clic sur le bouton `.theme-toggle-btn` :
   ```javascript
   document.documentElement.classList.toggle('light');
   localStorage.setItem('theme', newTheme);
   // + mise à jour des icônes .theme-icon (fa-sun / fa-moon)
   ```

3. Le CSS réagit via le sélecteur `html.light` sur toutes les classes concernées.

**Boutons dans le HTML :**
```html
<button class="theme-toggle-btn">
    <i class="fas fa-sun theme-icon"></i>
</button>
```
> Il peut y en avoir plusieurs (desktop + mobile). Tous sont liés via `.theme-toggle-btn`.

---

### 8.2 Traduction FR / EN

**Persistance** : `localStorage.getItem('lang')` → `'fr'` ou `'en'` (défaut : `'fr'`)

**Mécanisme :**

Chaque texte traduisible dans les templates porte un attribut `data-i18n` :
```html
<a data-i18n="nav.home">Accueil</a>
<span data-i18n="hero.greeting">Bonjour, je suis</span>
<button data-i18n="contact.send">Envoyer le message</button>
```

Au changement de langue, JavaScript remplace `textContent` de chaque élément par la valeur correspondante dans le dictionnaire `translations`.

**Éléments traduisibles couverts :**
- Navigation (navbar + menu mobile)
- Section hero (accroche, sous-titre, boutons)
- Titres de sections (projets, compétences, expérience, formation)
- Labels et textes de l'interface contact
- Textes du footer
- Titres et boutons de la page projets
- Texte "Présent" dans les timelines

**Contenu non traduit** (vient de la BDD) :
- Titres et descriptions des projets
- Noms et descriptions des expériences/formations
- Noms des compétences

> Pour un site entièrement bilingue, il faudrait gérer les champs en double dans les modèles (ex : `title_fr`, `title_en`) ou utiliser `django-modeltranslation`.

---

## 9. Base de données et fixtures

### Paramètres (développement)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Données initiales

Fichier : `core/fixtures/initial_data.json`

**Contenu pré-chargé :**

| Modèle         | Nombre | Détails                                     |
|---------------|--------|---------------------------------------------|
| `Skill`       | 13     | 4 frontend, 3 backend, 2 other, 4 tools    |
| `Experience`  | 3      | PANAFRICATECH, PERFORMANCE SERVICE, SOCEMCOOP |
| `Education`   | 5      | Licence, 2 certifications, BTS, Baccalauréat |
| `Project`     | 3      | Site web, App desktop, Module ODOO (tous featured) |

**Chargement :**
```bash
python manage.py loaddata core/fixtures/initial_data.json
```

**Export des données actuelles :**
```bash
python manage.py dumpdata core --indent 2 > core/fixtures/backup.json
```

---

## 10. Administration du contenu

URL : `http://127.0.0.1:8000/admin/`

### Gestion des compétences

1. Aller dans **Core > Skills**
2. Cliquer sur une compétence ou **Ajouter**
3. Renseigner :
   - **Name** : `Python`
   - **Icon** : classe Font Awesome → chercher sur [fontawesome.com](https://fontawesome.com) (ex: `fab fa-python`)
   - **Category** : `backend`
   - **Level** : `75` (pourcentage affiché dans la barre)
   - **Order** : numéro pour trier l'affichage

### Gestion des projets

1. Aller dans **Core > Projects** > **Ajouter**
2. Le **Slug** est auto-généré depuis le **Title**
3. **Technologies** : saisir séparées par des virgules : `Python, Django, PostgreSQL`
4. Cocher **Featured** pour afficher le projet sur la page d'accueil
5. **Image** : télécharger une capture d'écran (stockée dans `media/projects/`)

### Gestion des messages reçus

1. Aller dans **Core > Contact messages**
2. Les messages sont en lecture seule (protection contre la modification accidentelle)
3. Cocher **Is read** pour marquer comme lu (modifiable directement dans la liste)

---

## 11. Déploiement en production

### Variables d'environnement à modifier

Dans `config/settings.py` :

```python
# 1. Désactiver le mode debug
DEBUG = False

# 2. Définir les hôtes autorisés
ALLOWED_HOSTS = ['votre-domaine.com', 'www.votre-domaine.com']

# 3. Remplacer la SECRET_KEY par une vraie valeur secrète
# Générer : python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = 'votre-cle-secrete-generee'
```

### Fichiers statiques

```bash
# Collecter tous les fichiers statiques
python manage.py collectstatic
```

Configurer le serveur web (Nginx / Apache) pour servir le répertoire `staticfiles/`.

### Base de données en production

Remplacer SQLite par PostgreSQL dans `settings.py` :

```python
pip install psycopg2-binary

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'portfolio_db',
        'USER': 'votre_user',
        'PASSWORD': 'votre_mot_de_passe',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Checklist déploiement

- [ ] `DEBUG = False`
- [ ] `SECRET_KEY` sécurisée (variable d'environnement)
- [ ] `ALLOWED_HOSTS` configuré
- [ ] `python manage.py collectstatic`
- [ ] Serveur web configuré (Nginx + Gunicorn recommandé)
- [ ] HTTPS configuré (Let's Encrypt)
- [ ] Base de données PostgreSQL en production
- [ ] Sauvegardes de la BDD planifiées

---

## 12. Référence des variables de contexte

### `home.html`

| Variable           | Type               | Source                                 |
|-------------------|--------------------|----------------------------------------|
| `featured_projects`| QuerySet[Project] | `Project.objects.filter(featured=True)[:3]` |
| `skills`          | QuerySet[Skill]    | `Skill.objects.all()`                  |

### `about.html`

| Variable     | Type                | Source                       |
|-------------|---------------------|------------------------------|
| `skills`    | QuerySet[Skill]     | `Skill.objects.all()`        |
| `experiences`| QuerySet[Experience]| `Experience.objects.all()`  |
| `educations` | QuerySet[Education] | `Education.objects.all()`   |

### `projects.html`

| Variable    | Type          | Source                                                     |
|------------|---------------|------------------------------------------------------------|
| `projects` | QuerySet[Project] | `Project.objects.all()`                               |
| `all_techs`| list[str]     | Technologies uniques triées extraites de tous les projets  |

### `project_detail.html`

| Variable  | Type    | Source                                  |
|----------|---------|------------------------------------------|
| `project`| Project | `get_object_or_404(Project, slug=slug)` |

### `contact.html`

| Variable | Type        | Source                         |
|---------|-------------|--------------------------------|
| `form`  | ContactForm | `ContactForm()` ou `ContactForm(request.POST)` |

---

## 13. Ajout de contenu

### Ajouter un nouveau projet

**Via l'admin Django :**
1. `/admin/core/project/add/`
2. Remplir le formulaire (le slug est auto-généré)
3. Cocher "Featured" si à afficher sur la page d'accueil

**Via fixture (JSON) :**
```json
{
  "model": "core.project",
  "fields": {
    "title":             "Mon nouveau projet",
    "slug":              "mon-nouveau-projet",
    "description":       "Description complète…",
    "short_description": "Résumé en une ligne",
    "image":             null,
    "technologies":      "Python,Django,PostgreSQL",
    "github_url":        "https://github.com/user/repo",
    "live_url":          "https://mon-projet.com",
    "featured":          true,
    "order":             4
  }
}
```

### Ajouter une compétence

```json
{
  "model": "core.skill",
  "fields": {
    "name":     "React",
    "icon":     "fab fa-react",
    "category": "frontend",
    "level":    65,
    "order":    5
  }
}
```

### Ajouter une expérience

```json
{
  "model": "core.experience",
  "fields": {
    "position":    "Développeur Senior",
    "company":     "Nouvelle Entreprise",
    "location":    "Douala, Cameroun",
    "start_date":  "2025-01-01",
    "end_date":    null,
    "is_current":  true,
    "description": "Description des missions…",
    "order":       1
  }
}
```

---

## 14. Personnalisation du thème

### Modifier les couleurs du dégradé principal

Dans `static/css/style.css`, modifier la variable :
```css
:root {
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Exemple — orange : */
    /* --gradient-primary: linear-gradient(135deg, #f97316 0%, #dc2626 100%); */
}
```

### Modifier les textes de l'animation de frappe

Dans `templates/home.html`, modifier les attributs `data-typing-fr` et `data-typing-en` :
```html
<span id="typing-text"
    data-typing-fr='["Mon titre FR 1","Mon titre FR 2"]'
    data-typing-en='["My EN title 1","My EN title 2"]'>
</span>
```

### Ajouter une traduction

Dans `static/js/main.js`, ajouter la clé dans les deux langues :
```javascript
const translations = {
    fr: { 'ma.cle': 'Texte en français', … },
    en: { 'ma.cle': 'Text in English',   … }
};
```

Dans le template :
```html
<span data-i18n="ma.cle">Texte en français</span>
```

---

## Auteur

**Eclador Vynil Ndawa Djeutcha**
Développeur Python & ODOO — Douala, Cameroun
Email : Ecladorvynil507@gmail.com
Tél : +237 697 579 270 / 678 714 521

// Génère le site à partir de content/projets.mjs.
// Usage : node build.mjs
//   index.html à la racine (aperçu local) et dist/ (le dossier mis en ligne par Vercel).
// Variables d'environnement :
//   CONTACT_EMAIL  ton adresse e-mail, affichée dans Contact (jamais écrite dans le code)
//   SITE_URL       https://ton-domaine.fr (lien canonique, partage, sitemap), facultatif
import { writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { secteurs, projets } from './content/projets.mjs';
import { details } from './content/details.mjs';
import { parcours, outils } from './content/parcours.mjs';

const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const EMAIL = (process.env.CONTACT_EMAIL || '').trim();
const MAIL_HREF = EMAIL ? `mailto:${EMAIL}` : '#contact';
// Formulaire de contact : adresse Formspree (https://formspree.io/f/xxxx). Vide : le formulaire n'envoie rien.
const FORM_ENDPOINT = (process.env.FORM_ENDPOINT || '').trim();

// Image d'aperçu (LinkedIn, X…) : og/<nom>.png, générée par outils/og.py. Les réseaux exigent une adresse absolue.
const imageApercu = (nom, alt) => {
  const fichier = existsSync(new URL(`./og/${nom}.png`, import.meta.url)) ? nom : 'accueil';
  if (!SITE_URL || !existsSync(new URL(`./og/${fichier}.png`, import.meta.url))) return '';
  return `
  <meta property="og:image" content="${SITE_URL}/og/${fichier}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${alt}">`;
};

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // espaces insécables avant la ponctuation haute et les unités
  .replace(/ ([?!:;%])/g, ' $1').replace(/« /g, '« ').replace(/ »/g, ' »');

const pad = (n) => String(n).padStart(2, '0');

// ---------- Icônes (tracés Lucide, licence ISC) ----------
const ICONES = {
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  hf: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  externe: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  bas: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  lieu: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  cadenas: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'Santé': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  'E-commerce': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'Banque et finance': '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  'Grande distribution': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 2.004 0L20.7 7"/>',
  'Immobilier': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  'IA générative': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  gauche: '<path d="m15 18-6-6 6-6"/>',
  droite: '<path d="m9 18 6-6-6-6"/>',
  graphique: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  nuage: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  base: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  ondes: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
  certificat: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  langues: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  mallette: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  diplome: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  envoyer: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  haut: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  defaut: '<circle cx="12" cy="12" r="10"/>',
};
const icone = (nom, taille = 18) => `<svg class="icon" width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom] || ICONES.defaut}</svg>`;

// ---------- Visuels (HTML + CSS, responsives) ----------
function barres(v) {
  const rows = v.barres.map(([label, val, txt, lead], i) => `
            <li class="bars__row${lead ? ' is-lead' : ''}" style="--i:${i}; --v:${(val / v.max).toFixed(4)}">
              <span class="bars__label">${esc(label)}</span>
              <span class="bars__track"><span class="bars__bar"></span><span class="bars__val num">${esc(txt)}</span></span>
            </li>`).join('');
  return `<ol class="bars" aria-label="${esc(v.titre)}">${rows}
          </ol>`;
}

function points(v) {
  const span = v.max - v.min;
  const pos = (x) => ((x - v.min) / span).toFixed(4);
  const ticks = v.graduations.map(([x, t]) => `<span class="dots__tick num" style="--x:${pos(x)}">${esc(t)}</span>`).join('');
  const rows = v.points.map(([label, val, txt, lead], i) => `
            <li class="dots__row${lead ? ' is-lead' : ''}" style="--i:${i}; --x:${pos(val)}">
              <span class="dots__label">${esc(label)}</span>
              <span class="dots__track"><span class="dots__dot"></span><span class="dots__val num">${esc(txt)}</span></span>
            </li>`).join('');
  return `<ol class="dots" aria-label="${esc(v.titre)}">${rows}
          </ol>
          <div class="dots__axis" aria-hidden="true"><span></span><span class="dots__ticks">${ticks}</span></div>`;
}

function chaine(v) {
  const rows = v.etapes.map(([t, d], i) => `
            <li class="chain__step" style="--i:${i}${v.retrait ? `; --r:${i}` : ''}">
              <span class="chain__name">${esc(t)}</span>${d ? `<span class="chain__detail">${esc(d)}</span>` : ''}
            </li>`).join('');
  return `<ol class="chain${v.retrait ? ' chain--tree' : ''}" aria-label="${esc(v.titre)}">${rows}
          </ol>`;
}

const visuel = (v) => ({ barres, points, chaine }[v.type](v));

// ---------- Index et fiches ----------
let n = 0;
const ordre = secteurs.flatMap((s) => projets.filter((p) => p.secteur === s));
const numero = new Map(ordre.map((p) => [p.id, pad(++n)]));
const secteursUtilises = secteurs.filter((s) => projets.some((p) => p.secteur === s));

const groupes = secteursUtilises.map((s) => {
  const l = projets.filter((p) => p.secteur === s);
  return `
          <li class="group">
            <h3 class="group__name"><span>${icone(s, 16)}${esc(s)}</span><span class="num">${pad(l.length)}</span></h3>
            <ul class="group__rows">${l.map((p) => `
              <li><a class="row" href="#p-${p.id}" data-id="${p.id}" aria-controls="p-${p.id}"><span class="row__num num">${numero.get(p.id)}</span><span class="row__name">${esc(p.nom)}</span></a></li>`).join('')}
            </ul>
          </li>`;
}).join('');

const liensExternes = (p, classe = 'panel__link') => p.client
  ? `<span class="panel__private">${icone('cadenas', 16)}Réalisé pour ${esc(p.client)}, code et démo non publics</span>`
  : [p.demo && `<a class="${classe} ${classe}--demo" href="${p.demo}">${icone('externe', 16)}Voir la démo</a>`,
     p.depot && `<a class="${classe}" href="${p.depot}">${icone('github', 16)}Voir le dépôt</a>`].filter(Boolean).join('');
const liens = (p) => `<a class="panel__link panel__link--page" href="projets/${p.id}.html">Voir le projet${icone('droite', 16)}</a>${liensExternes(p)}`;

const panneaux = ordre.map((p, i) => {
  const prev = ordre[(i - 1 + ordre.length) % ordre.length];
  const next = ordre[(i + 1) % ordre.length];
  const outils = p.pile.split(/,\s*/).map((o) => `<li>${esc(o)}</li>`).join('');
  return `
        <article class="panel" id="p-${p.id}" data-id="${p.id}" data-draw aria-labelledby="t-${p.id}">
          <div class="panel__bar">
            <span class="panel__count num">${numero.get(p.id)} / ${pad(ordre.length)}</span>
            <span class="chip">${icone(p.secteur, 14)}${esc(p.secteur)}</span>
            ${p.discipline !== p.secteur ? `<span class="chip chip--cool">${esc(p.discipline)}</span>` : ''}
            <span class="panel__nav">
              <a class="panel__step" href="#p-${prev.id}" data-go="${prev.id}" aria-label="Projet précédent : ${esc(prev.nom)}">${icone('gauche', 18)}</a>
              <a class="panel__step" href="#p-${next.id}" data-go="${next.id}" aria-label="Projet suivant : ${esc(next.nom)}">${icone('droite', 18)}</a>
            </span>
          </div>
          <div class="panel__head">
            <div class="panel__heading">
              <h3 class="panel__title" id="t-${p.id}">${esc(p.nom)}</h3>
              <p class="panel__q">${esc(p.question)}</p>
            </div>
            ${p.mesure ? `<p class="reading"><span class="reading__val num">${esc(p.mesure.valeur)}</span><span class="reading__unit">${esc(p.mesure.unite)}</span></p>` : ''}
          </div>
          <div class="panel__body">
            <dl class="par">
              <div><dt>Problème</dt><dd>${esc(p.probleme)}</dd></div>
              <div><dt>Approche</dt><dd>${esc(p.approche)}</dd></div>
              <div><dt>Résultat</dt><dd>${esc(p.resultat)}</dd></div>
            </dl>
            <figure class="viz">
            ${visuel(p.visuel)}
              <figcaption>${esc(p.visuel.titre)}</figcaption>
            </figure>
          </div>
          <div class="panel__foot">
            <ul class="panel__tools" aria-label="Outils">${outils}</ul>
            <p class="panel__links">${liens(p)}</p>
          </div>
        </article>`;
}).join('');

// Données du nuage 3D
const nuage = JSON.stringify({
  secteurs: secteursUtilises,
  projets: ordre.map((p) => ({ id: p.id, nom: p.nom, secteur: p.secteur })),
});

// Preuves chiffrées : uniquement des résultats déjà présents dans les projets
// [valeur, unité, ce qu'elle mesure, id du projet, nom affiché si différent du projet]
const preuves = [
  ['2', '', 'plateformes en production, hébergées en local', 'fireprotect', 'FireProtect et Celsius'],
  ['3', '', 'clouds pour un même assistant RAG en ligne', 'rag'],
  ['−14,6', '%', 'de coût, gain mesuré face à la règle en place', 'demande'],
  ['82,3', '%', 'des départs clients détectés', 'churn'],
];
const projetDe = new Map(projets.map((p) => [p.id, p]));
const bandeau = preuves.map(([v, u, l, id, nom], i) => {
  const p = projetDe.get(id);
  return `
          <li${i === 0 ? ' class="is-lead"' : ''}>
            <a class="proof" href="projets/${id}.html">
              <span class="proof__val num">${esc(v)}${u ? `<span class="proof__unit">${esc(u)}</span>` : ''}</span>
              <span class="proof__label">${esc(l)}</span>
              <span class="proof__project">${icone(p.secteur, 16)}<span>${esc(nom || p.nom)}</span>${icone('droite', 16)}</span>
            </a>
          </li>`;
}).join('');

const ligneEmail = EMAIL
  ? `
            <div><dt>${icone('mail')}E-mail</dt><dd><a href="${MAIL_HREF}">${esc(EMAIL)}</a></dd></div>`
  : '';

const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Luc Obama, data scientist et AI engineer à Nantes</title>
  <meta name="description" content="Luc Obama, data scientist et AI engineer à Nantes : assistants RAG en ligne, automatisation, plateformes hébergées en local et gains mesurés, sur ${ordre.length} projets.">
  <meta property="og:title" content="Luc Obama, data scientist et AI engineer">
  <meta property="og:description" content="Je transforme une question métier en modèle mesuré, puis en service en production.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">${SITE_URL ? `
  <link rel="canonical" href="${SITE_URL}/">
  <meta property="og:url" content="${SITE_URL}/">` : ''}${imageApercu('accueil', 'Luc Obama, data scientist et AI engineer : une question métier, un modèle, un chiffre.')}
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/site.css">
  <script>document.documentElement.classList.add('js');</script>
</head>
<body>
  <a class="skip" href="#main">Aller au contenu</a>

  <header class="bar">
    <div class="container bar__inner">
      <a class="wordmark" href="#main" aria-label="Luc Obama, retour en haut">Luc Obama</a>
      <nav class="bar__nav" aria-label="Navigation principale">
        <a href="#travaux">Travaux</a>
        <a href="#methode">Méthode</a>
        <a href="#parcours">Parcours</a>
        <a class="bar__action" href="#contact">${icone('mail', 16)}Contact</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero" aria-labelledby="hero-titre" data-loop>
      <canvas class="hero__cloud" role="img" aria-label="Nuage en trois dimensions : chaque point lumineux est un projet, regroupé par secteur. Cliquer un point ouvre sa fiche."></canvas>
      <script type="application/json" id="cloud-data">${nuage}</script>

      <div class="container hero__inner">
        <div class="hero__text">
          <h1 id="hero-titre" data-reveal style="--i:0">Une question métier,<br><span class="rotator" data-rotator><span class="rotator__word is-on">un modèle,</span><span class="rotator__word" aria-hidden="true">un assistant,</span><span class="rotator__word" aria-hidden="true">une API,</span></span><br>un chiffre.</h1>
          <p class="hero__lead" data-reveal style="--i:1">C’est ainsi que j’ai mené ${ordre.length} projets de data science et d’IA : des assistants RAG en ligne, des tâches automatisées, des plateformes hébergées en local, et à chaque fois un gain mesuré.</p>
          <div class="actions" data-reveal style="--i:2">
            <a class="btn btn--primary" href="#travaux">Voir les ${ordre.length} projets${icone('bas')}</a>
            <a class="btn" href="${MAIL_HREF}">${icone('mail')}M’écrire</a>
          </div>
          <p class="hero__status" data-reveal style="--i:3">${icone('lieu', 16)}Nantes, ouvert à une alternance, un CDI ou une mission.</p>
        </div>
      </div>

      <div class="hero__foot">
        <div class="container hero__foot-inner">
          <p>Chaque point est un projet, groupé par secteur. Glissez pour faire pivoter.</p>
          <button class="hero__toggle" type="button" data-loop-toggle aria-pressed="false">Pause</button>
        </div>
      </div>
    </section>

    <section class="proofs" aria-label="Résultats clés">
      <div class="container">
        <ul class="proofs__list proofs__list--links" data-reveal>${bandeau}
        </ul>
      </div>
    </section>

    <section class="work" id="travaux" aria-labelledby="travaux-titre">
      <div class="container">
        <div class="work__head" data-reveal>
          <h2 id="travaux-titre">Ce que j’ai livré, secteur par secteur.</h2>
          <p class="lead">Chaque projet part d’une question métier et se termine par un chiffre. Choisissez-en un.</p>
        </div>
        <div class="work__grid">
          <ol class="index" data-reveal>${groupes}
          </ol>
          <div class="stage" aria-live="polite">${panneaux}
          </div>
        </div>
      </div>
    </section>

    <section class="method" id="methode" aria-labelledby="methode-titre">
      <div class="container">
        <h2 id="methode-titre" data-reveal>Faire l’état des lieux, déployer, mesurer.</h2>
        <ol class="steps" data-reveal>
          <li class="is-lead"><h3>État des lieux</h3><p>Partir de la tâche et de la référence actuelle : ce qu’elle coûte, ce qu’elle prend comme temps, quelles données elle touche. Chaque projet est comparé à la règle déjà en place.</p></li>
          <li><h3>Déployer, sans exposer les données</h3><p>RAG, automatisation ou plateforme : hébergement maîtrisé quand les données l’exigent, accès cloisonnés, conteneurs, tests et CI/CD.</p></li>
          <li><h3>Mesurer les gains</h3><p>Des métriques fixées à l’avance, lues sur des données jamais vues, avec leurs limites écrites. Puis un suivi en production : Grafana, LangSmith.</p></li>
        </ol>
      </div>
    </section>

    <section class="tools" aria-labelledby="outils-titre">
      <div class="container">
        <div class="tools__head" data-reveal>
          <h2 id="outils-titre">La boîte à outils.</h2>
          <p class="lead">Ce que j’utilise d’un projet à l’autre, de la donnée brute au serveur.</p>
        </div>
        <dl class="toolgrid" data-reveal>${outils.map(([cat, ico, liste]) => `
          <div><dt>${icone(ico, 22)}${esc(cat)}</dt><dd><ul class="logos">${liste.map(([nom, logo]) => `<li>${logo
            ? `<img src="https://cdn.simpleicons.org/${logo}/c9cfd6" width="18" height="18" alt="" loading="lazy" decoding="async">`
            : ''}${esc(nom)}</li>`).join('')}</ul></dd></div>`).join('')}
        </dl>
      </div>
    </section>

    <section class="path" id="parcours" aria-labelledby="parcours-titre">
      <div class="container">
        <div class="tools__head" data-reveal>
          <h2 id="parcours-titre">Du génie logiciel à l’IA.</h2>
          <p class="lead">Deux postes chez IBMH Conseils, après un master en data science.</p>
        </div>
        <ol class="timeline">${parcours.map((e, i) => `
          <li class="timeline__item${i === 0 ? ' is-current' : ''}" data-reveal style="--i:${i}">
            <div class="timeline__meta">
              <span class="timeline__when num">${esc(e.quand)}</span>
              <span class="chip${e.type === 'Formation' ? '' : ' chip--cool'}">${icone(e.type === 'Formation' ? 'diplome' : 'mallette', 14)}${esc(e.type)}</span>
            </div>
            <div class="timeline__card">
              <h3>${esc(e.titre)}</h3>
              <p class="timeline__place">${icone('lieu', 16)}${esc(e.lieu)}</p>${e.missions ? `
              <ul class="timeline__missions">${e.missions.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}${e.tags ? `
              <ul class="panel__tools">${e.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
            </div>
          </li>`).join('')}
        </ol>
        <dl class="extras" data-reveal>
          <div><dt>${icone('certificat', 20)}Certifications</dt><dd>Simulation Data Analytics, Deloitte Australia<br>Simulation Data Science, British Airways</dd></div>
          <div><dt>${icone('langues', 20)}Langues</dt><dd>Français natif<br>Anglais professionnel<br>Allemand élémentaire</dd></div>
        </dl>
      </div>
    </section>

    <section class="contact" id="contact" aria-labelledby="contact-titre">
      <div class="container">
        <h2 id="contact-titre" data-reveal>Parlons de vos données.</h2>
        <div class="contact__grid">
          <div class="contact__side" data-reveal>
            <p class="lead">Alternance, CDI ou mission : décrivez la décision à prendre et les données dont vous disposez.</p>
            <dl class="lines lines--contact">${ligneEmail}
              <div><dt>${icone('linkedin')}LinkedIn</dt><dd><a href="https://www.linkedin.com/in/luc-obama">linkedin.com/in/luc-obama</a></dd></div>
              <div><dt>${icone('github')}GitHub</dt><dd><a href="https://github.com/Loscope29">github.com/Loscope29</a></dd></div>
              <div><dt>${icone('hf')}Hugging Face</dt><dd><a href="https://huggingface.co/Loscope29">huggingface.co/Loscope29</a></dd></div>
            </dl>
          </div>
          <form class="form" data-endpoint="${esc(FORM_ENDPOINT)}" novalidate data-reveal style="--i:1">
            <div class="field">
              <label for="f-nom">Votre nom</label>
              <input id="f-nom" name="nom" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="f-email">Votre e-mail</label>
              <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required>
            </div>
            <div class="field">
              <label for="f-objet">Objet</label>
              <select id="f-objet" name="objet">
                <option>Alternance</option>
                <option>CDI</option>
                <option>Mission</option>
                <option>Autre</option>
              </select>
            </div>
            <div class="field">
              <label for="f-message">Votre message</label>
              <textarea id="f-message" name="message" rows="5" required></textarea>
            </div>
            <input class="form__trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="form__foot">
              <button class="btn btn--primary" type="submit">${icone('envoyer')}Envoyer le message</button>
              <p class="form__status" role="status" aria-live="polite"></p>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer class="colophon">
    <div class="container">
      <p>Luc Obama, Nantes. Chiffres tirés des rapports de chaque projet. Mis à jour en novembre 2026.</p>
    </div>
  </footer>

  <a class="totop" href="#main" aria-label="Revenir en haut de la page" data-totop>${icone('haut', 20)}</a>

  <script src="scripts/site.js" defer></script>
</body>
</html>
`;

// ---------- Pages de détail, une par projet (projets/<id>.html) ----------
// Captures d'écran : captures/<id>.png, puis <id>-2, <id>-3 (png, jpg ou webp)
const capturesDe = (id) => [id, `${id}-2`, `${id}-3`]
  .map((nom) => ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `captures/${nom}.${ext}`).find((f) => existsSync(new URL(`./${f}`, import.meta.url))))
  .filter(Boolean);

const pageProjet = (p, i) => {
  const d = details[p.id] || {};
  const captures = capturesDe(p.id);
  const prev = ordre[(i - 1 + ordre.length) % ordre.length];
  const next = ordre[(i + 1) % ordre.length];
  const ecrire = EMAIL ? MAIL_HREF : '../#contact';
  const outils = p.pile.split(/,\s*/).map((o) => `<li>${esc(o)}</li>`).join('');
  const contexte = (d.contexte || []).map((t) => `<p>${esc(t)}</p>`).join('');
  const section = (id, titre, corps) => corps ? `
    <section class="detail__section" aria-labelledby="${id}">
      <div class="container split">
        <h2 id="${id}" data-reveal>${titre}</h2>
        <div data-reveal>${corps}</div>
      </div>
    </section>` : '';

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.nom)}, projet de Luc Obama</title>
  <meta name="description" content="${esc(p.question)} ${esc(p.resultat)}">
  <meta property="og:title" content="${esc(p.nom)}, projet de Luc Obama">
  <meta property="og:description" content="${esc(p.question)}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">${SITE_URL ? `
  <link rel="canonical" href="${SITE_URL}/projets/${p.id}">
  <meta property="og:url" content="${SITE_URL}/projets/${p.id}">` : ''}${imageApercu(p.id, `${esc(p.nom)}, projet de Luc Obama`)}
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/site.css">
  <script>document.documentElement.classList.add('js');</script>
</head>
<body>
  <a class="skip" href="#main">Aller au contenu</a>

  <header class="bar">
    <div class="container bar__inner">
      <a class="wordmark" href="../" aria-label="Luc Obama, accueil du portfolio">Luc Obama</a>
      <nav class="bar__nav" aria-label="Navigation principale">
        <a href="../#travaux">Travaux</a>
        <a href="../#methode">Méthode</a>
        <a href="../#parcours">Parcours</a>
        <a class="bar__action" href="../#contact">${icone('mail', 16)}Contact</a>
      </nav>
    </div>
  </header>

  <main id="main" class="detail">
    <section class="detail__hero">
      <div class="container">
        <nav class="crumbs" aria-label="Fil d’Ariane">
          <a href="../#travaux">${icone('gauche', 16)}Tous les projets</a>
          <span class="num">${numero.get(p.id)} / ${pad(ordre.length)}</span>
        </nav>
        <div class="detail__head">
          <div class="detail__title" data-reveal>
            <div class="panel__bar">
              <span class="chip">${icone(p.secteur, 14)}${esc(p.secteur)}</span>
              ${p.discipline !== p.secteur ? `<span class="chip chip--cool">${esc(p.discipline)}</span>` : ''}
            </div>
            <h1>${esc(p.nom)}</h1>
            <p class="lead">${esc(p.question)}</p>
            <p class="detail__links">${liensExternes(p, 'btn')}</p>
          </div>
          ${p.mesure ? `<p class="reading detail__reading" data-reveal style="--i:1"><span class="reading__val num">${esc(p.mesure.valeur)}</span><span class="reading__unit">${esc(p.mesure.unite)}</span></p>` : ''}
        </div>
      </div>
    </section>

    <section class="detail__par" aria-label="En bref">
      <div class="container">
        <dl class="par par--wide" data-reveal>
          <div><dt>Problème</dt><dd>${esc(p.probleme)}</dd></div>
          <div><dt>Approche</dt><dd>${esc(p.approche)}</dd></div>
          <div><dt>Résultat</dt><dd>${esc(p.resultat)}</dd></div>
        </dl>
      </div>
    </section>

    <section class="detail__viz" aria-label="${esc(p.visuel.titre)}">
      <div class="container">
        <figure class="viz viz--wide" data-draw>
          ${visuel(p.visuel)}
          <figcaption>${esc(p.visuel.titre)}</figcaption>
        </figure>
      </div>
    </section>
${captures.length ? `
    <section class="detail__section detail__shots" aria-labelledby="captures">
      <div class="container">
        <h2 id="captures" data-reveal>L’application.</h2>
        <div class="shots${captures.length > 1 ? ' shots--multi' : ''}">${captures.map((f, k) => `
          <figure class="shot" data-reveal style="--i:${k}"><img src="../${f}" alt="Capture d’écran de ${esc(p.nom)}${captures.length > 1 ? `, vue ${k + 1}` : ''}" loading="lazy" decoding="async"></figure>`).join('')}
        </div>
      </div>
    </section>` : ''}
${section('contexte', 'Le contexte', contexte
  + (d.donnees ? `<h3 class="detail__sub">Les données</h3><p>${esc(d.donnees)}</p>` : '')
  + (d.source ? `<p class="detail__source"><a href="${d.source[1]}">${icone('externe', 16)}Source : ${esc(d.source[0])}</a></p>` : ''))}
${section('demarche', 'La démarche', d.etapes ? `<ol class="detail__steps">${d.etapes.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>` : '')}
${d.resultats ? `
    <section class="detail__section detail__results" aria-labelledby="resultats">
      <div class="container">
        <h2 id="resultats" data-reveal>Les résultats</h2>
        <ul class="proofs__list detail__figures" data-reveal>${d.resultats.map(([v, l], k) => `
          <li${k === 0 ? ' class="is-lead"' : ''}><span class="proofs__val num">${esc(v)}</span><span class="proofs__label">${esc(l)}</span></li>`).join('')}
        </ul>
      </div>
    </section>` : ''}
${section('limites', 'Les limites', d.limites ? `<ul class="detail__limits">${d.limites.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : '')}
${section('outils', 'Les outils', `<ul class="panel__tools detail__tools">${outils}</ul>`)}

    <nav class="detail__more" aria-label="Autres projets">
      <div class="container detail__more-grid">
        <a class="detail__next" href="${prev.id}.html"><span class="detail__dir">${icone('gauche', 16)}Projet précédent</span><span class="detail__name">${esc(prev.nom)}</span><span class="detail__sector">${esc(prev.secteur)}</span></a>
        <a class="detail__next detail__next--right" href="${next.id}.html"><span class="detail__dir">Projet suivant${icone('droite', 16)}</span><span class="detail__name">${esc(next.nom)}</span><span class="detail__sector">${esc(next.secteur)}</span></a>
      </div>
    </nav>

    <section class="detail__cta">
      <div class="container detail__cta-inner">
        <h2>Un projet du même genre&nbsp;?</h2>
        <div class="actions">
          <a class="btn btn--primary" href="${ecrire}">${icone('mail')}M’écrire</a>
          <a class="btn" href="../#travaux">Voir les ${ordre.length} projets</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="colophon">
    <div class="container">
      <p>Luc Obama, Nantes. Chiffres tirés des rapports du projet.</p>
    </div>
  </footer>

  <script src="../scripts/site.js" defer></script>
</body>
</html>
`;
};

// Page 404, avec des chemins absolus car elle est servie à n'importe quelle adresse
const page404 = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page introuvable, Luc Obama</title>
  <meta name="description" content="Cette page n’existe pas. Retour au portfolio de Luc Obama, data scientist et AI engineer.">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/site.css">
</head>
<body>
  <main class="notfound">
    <div class="container notfound__inner">
      <p class="notfound__code num">404</p>
      <h1>Cette page n’existe pas.</h1>
      <p class="lead">Le lien est peut-être ancien, ou mal recopié.</p>
      <div class="actions">
        <a class="btn btn--primary" href="/">${icone('gauche')}Revenir au portfolio</a>
        <a class="btn" href="/#contact">${icone('mail')}Me contacter</a>
      </div>
    </div>
  </main>
</body>
</html>
`;

const robots = `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''}`;
const sitemap = SITE_URL && `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>${ordre.map((p) => `
  <url><loc>${SITE_URL}/projets/${p.id}</loc></url>`).join('')}
</urlset>
`;

// Aperçu local à la racine
const racine = (f) => new URL(`./${f}`, import.meta.url);
writeFileSync(racine('index.html'), html);
writeFileSync(racine('404.html'), page404);
const pages = ordre.map((p, i) => [p.id, pageProjet(p, i)]);
rmSync(racine('projets/'), { recursive: true, force: true });
mkdirSync(racine('projets/'), { recursive: true });
for (const [id, page] of pages) writeFileSync(racine(`projets/${id}.html`), page);

// Dossier mis en ligne : uniquement ce que le visiteur doit recevoir
const dist = racine('dist/');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
writeFileSync(new URL('index.html', dist), html);
writeFileSync(new URL('404.html', dist), page404);
writeFileSync(new URL('robots.txt', dist), robots);
if (sitemap) writeFileSync(new URL('sitemap.xml', dist), sitemap);
mkdirSync(new URL('projets/', dist), { recursive: true });
for (const [id, page] of pages) writeFileSync(new URL(`projets/${id}.html`, dist), page);
for (const f of ['favicon.svg', 'styles', 'scripts', 'og', 'captures']) if (existsSync(racine(f))) cpSync(racine(f), new URL(f, dist), { recursive: true });

console.log(`index.html : ${ordre.length} projets, ${secteursUtilises.length} secteurs, ${pages.length} pages de détail.`);
if (!EMAIL) console.log('CONTACT_EMAIL non défini : la ligne e-mail est masquée et « M’écrire » mène à la section Contact.');
if (!FORM_ENDPOINT) console.log('FORM_ENDPOINT non défini : le formulaire de contact n’envoie rien et le signale.');
console.log(`dist/ prêt${SITE_URL ? ` pour ${SITE_URL}` : ' (SITE_URL non défini : pas de lien canonique ni de sitemap)'}.`);

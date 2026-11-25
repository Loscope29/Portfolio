# Portfolio de Luc Obama

Site statique (HTML, CSS, JavaScript, sans framework). Les projets sont décrits dans un seul fichier,
`content/projets.mjs`, et la page `index.html` est générée à partir de lui par `node build.mjs`.

## Voir le site en local

Ton adresse e-mail n'est écrite nulle part dans le code : le script la lit dans la variable
`CONTACT_EMAIL`. Sans elle, la ligne e-mail est masquée et « M'écrire » mène à la section Contact.

```powershell
$env:CONTACT_EMAIL = "ton.adresse@exemple.com"
```

```powershell
node build.mjs
```

```powershell
python -m http.server 5173
```

Puis ouvrir http://localhost:5173. Le script produit aussi `dist/`, le dossier exact que Vercel met en ligne.

## Ajouter un projet

1. Ouvrir `content/projets.mjs`.
2. Copier un projet existant du même type de visuel et le coller dans le bon secteur.
3. Remplir les champs :

| Champ | Rôle | Exemple |
|---|---|---|
| `id` | identifiant court, unique, sans espace | `'fraude'` |
| `secteur` | un nom de la liste `secteurs` en haut du fichier | `'Banque et finance'` |
| `discipline` | `'Data science'`, `'IA générative'` ou `'IoT et cloud'` | `'Data science'` |
| `nom` | titre court | `'Détection de fraude'` |
| `question` | la question métier, en une phrase | `'Quelles transactions bloquer avant le paiement ?'` |
| `mesure` | le résultat principal, ou supprimer la ligne | `{ valeur: '82 %', unite: 'des fraudes détectées' }` |
| `pile` | outils principaux | `'XGBoost, SHAP, FastAPI'` |
| `depot` | lien GitHub, ou `null` | `'https://github.com/Loscope29/...'` |
| `demo` | lien de la solution en ligne, ou `null` | `'https://...'` |
| `client` | seulement pour un projet qui appartient à une entreprise | `'IBMH Conseils'` |
| `visuel` | ce qui se dessine dans le panneau (voir ci-dessous) | |

4. Lancer `node build.mjs`, vérifier en local, puis pousser sur GitHub : Vercel redéploie seul.

### Les trois visuels

**Barres** (comparer des modèles ou des scores) :

```js
visuel: {
  type: 'barres',
  titre: 'Rappel sur le jeu de test',
  max: 100,                         // la valeur qui remplit toute la barre
  barres: [
    ['Régression logistique', 64, '64 %'],
    ['XGBoost', 82, '82 %', true],  // true : la barre mise en avant
  ],
},
```

**Points** (des estimations sur un même axe) :

```js
visuel: {
  type: 'points',
  titre: 'Élasticité selon l’estimateur',
  min: -2, max: 0,
  graduations: [[-2, '−2'], [-1, '−1'], [0, '0']],
  points: [['OLS', -0.02, '−0,02'], ['Effets fixes', -0.75, '−0,75', true]],
},
```

**Chaîne** (l'architecture d'un système, étape par étape) :

```js
visuel: {
  type: 'chaine',
  titre: 'Architecture de l’API',
  etapes: [
    ['Données', 'CSV, PostgreSQL'],
    ['Modèle', 'XGBoost'],
    ['Service', 'FastAPI sur Cloud Run'],
  ],
},
```

Ajouter `retrait: true` pour une hiérarchie (chaque étape décalée sous la précédente).

### La page de détail du projet

Chaque projet a sa page, générée dans `projets/<id>.html` (en ligne : `/projets/<id>`). Elle reprend la
fiche et y ajoute ce que tu écris dans `content/details.mjs`, sous la même `id` :

```js
fraude: {
  contexte: ['La situation et l’enjeu, en un ou deux paragraphes.'],
  donnees: 'D’où viennent les données et ce qu’elles contiennent.',
  etapes: ['Exploration', 'Modèle XGBoost', 'API FastAPI sur Cloud Run'],
  resultats: [['82 %', 'des fraudes détectées sur le test']],
  limites: ['Ce que le projet ne prouve pas encore.'],
},
```

Tous ces champs sont facultatifs : une section vide n’apparaît pas.

### Les captures d'écran de l'application

Déposer les captures dans un dossier `captures/`, nommées d'après l'`id` du projet :
`captures/churn.png`, puis `churn-2.png` et `churn-3.png` (png, jpg ou webp). Elles s'affichent en grand
sur la page du projet, dans une section « L'application ». Largeur conseillée : 1600 px.

### L'image d'aperçu (LinkedIn, X, messageries)

Après avoir ajouté un projet ou changé son chiffre clé, regénérer les images (Python et Pillow) :

```powershell
python outils/og.py
```

Elles sont écrites dans `og/` (une pour l'accueil, une par projet) et ne s'affichent sur LinkedIn que si
`SITE_URL` est défini, car les réseaux exigent une adresse absolue. Un projet sans image utilise celle de l'accueil.

## Modifier le parcours ou la boîte à outils

Tout est dans `content/parcours.mjs` : les postes et formations (missions, outils) et les catégories
d'outils, avec le logo Simple Icons de chacun quand il existe.

## Brancher le formulaire de contact

1. Créer un compte gratuit sur formspree.io et un formulaire : il fournit une adresse du type
   `https://formspree.io/f/abcdwxyz`, et transmet chaque message à ta boîte mail.
2. La mettre dans la variable `FORM_ENDPOINT` (sur Vercel : *Settings > Environment Variables*), puis redéployer.

Sans cette variable, le formulaire n'envoie rien et le dit au visiteur.

## Ajouter un secteur

Ajouter son nom dans la liste `secteurs` en haut de `content/projets.mjs`. L'ordre de la liste est l'ordre
d'affichage. Un secteur sans projet n'apparaît pas.

## Déployer sur Vercel

`vercel.json` règle déjà tout : construction (`node build.mjs`), dossier publié (`dist/`), adresses sans
`.html`, en-têtes de sécurité et page 404.

1. Créer un dépôt GitHub avec ce dossier et le pousser (`dist/` est ignoré, Vercel le reconstruit).
2. Sur vercel.com : *Add New Project*, importer le dépôt, preset *Other*. Ne rien changer aux réglages de build.
3. *Settings > Environment Variables*, pour *Production* et *Preview* :
   - `CONTACT_EMAIL` : ton adresse e-mail ;
   - `SITE_URL` : `https://ton-domaine.fr`, une fois le domaine choisi (lien canonique, `sitemap.xml`, images d'aperçu) ;
   - `FORM_ENDPOINT` : l'adresse Formspree du formulaire de contact.
4. *Settings > Domains* : ajouter le domaine et créer chez ton registraire les enregistrements DNS que Vercel
   affiche, puis relancer un déploiement (*Deployments > Redeploy*) pour prendre en compte les variables.

Ensuite, chaque `git push` sur la branche principale redéploie le site.

Avec Vercel CLI (déjà installé) plutôt que GitHub, depuis ce dossier :

```powershell
vercel
```

```powershell
vercel --prod
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `content/projets.mjs` | les projets et les secteurs |
| `content/details.mjs` | le contenu des pages de détail |
| `content/parcours.mjs` | le parcours et la boîte à outils |
| `captures/` | les captures d'écran des applications (facultatif) |
| `projets/` | pages de détail générées, ne pas modifier à la main |
| `build.mjs` | génère `index.html`, `404.html` et `dist/` (textes du hero, compétences, parcours, contact : à modifier ici) |
| `vercel.json` | réglages de déploiement |
| `outils/og.py` | génère les images d'aperçu dans `og/` |
| `dist/` | généré, ne pas modifier à la main |
| `styles/tokens.css` | couleurs, polices, espacements |
| `styles/site.css` | mise en page et animations |
| `scripts/site.js` | index interactif, nuage 3D, apparitions au défilement |

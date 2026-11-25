// Projets du portfolio, rangés par secteur.
// Pour ajouter un projet : copier un objet dans `projets`, puis lancer `node build.mjs`.
// Pour ajouter un secteur : l'ajouter à `secteurs` (l'ordre de cette liste est l'ordre d'affichage).
//
// Champs :
//   id         identifiant court, sans espace
//   secteur    l'un des noms de `secteurs`
//   discipline "Data science", "IA générative" ou "IoT et cloud"
//   nom        titre court
//   question   la question métier, en une phrase (sert au nuage et au référencement)
//   probleme, approche, resultat   la fiche du projet, une phrase chacun
//   mesure     { valeur, unite } : le résultat principal (facultatif, jamais inventé)
//   pile       outils principaux
//   depot      URL du dépôt GitHub, ou null si le code n'est pas public
//   demo       URL de la solution en ligne, ou null tant qu'elle n'est pas déployée
//   client     pour un projet réalisé pour une entreprise qui en garde la propriété : son nom
//   visuel     { type: "barres" | "points" | "chaine", ... } : dessiné dans le panneau

export const secteurs = [
  'Santé',
  'E-commerce',
  'Banque et finance',
  'Grande distribution',
  'IA générative',
];

const GH = 'https://github.com/Loscope29';

export const projets = [
  // ---------- Santé ----------
  {
    id: 'fireprotect',
    secteur: 'Santé',
    discipline: 'IoT et cloud',
    nom: 'FireProtect',
    question: 'Détecter un départ de feu et déclencher les sirènes.',
    probleme: 'Alerter vite, sans fausse alarme, sur des sites de plusieurs clients.',
    approche: 'Capteurs LoRaWAN, détection confirmée par plusieurs capteurs, données isolées par client.',
    resultat: 'En production chez IBMH Conseils : alarmes, sirènes et notifications.',
    pile: 'Django, Next.js, TimescaleDB, Traefik',
    depot: null,
    demo: null,
    client: 'IBMH Conseils',
    visuel: {
      type: 'chaine',
      titre: 'Chaîne de détection FireProtect',
      etapes: [
        ['Capteurs', 'fumée, déclencheur manuel'],
        ['Réseau LoRaWAN', 'ChirpStack, MQTT'],
        ['Détection', 'Django, confirmation multi-capteurs'],
        ['Données', 'PostgreSQL, isolation par client'],
        ['Action', 'sirènes, relais, notifications'],
      ],
    },
  },
  {
    id: 'celsius',
    secteur: 'Santé',
    discipline: 'IoT et cloud',
    nom: 'Celsius',
    question: 'Surveiller la chaîne du froid, jusqu’aux groupes hospitaliers.',
    probleme: 'Prouver que la chaîne du froid tient, du frigo à la chambre froide.',
    approche: 'Capteurs de température LoRaWAN, organisation client, site, bâtiment, local, alertes de seuil.',
    resultat: 'En production chez IBMH Conseils, pour des clients répartis sur plusieurs sites.',
    pile: 'LoRaWAN, ChirpStack, Docker, GitHub Actions',
    depot: null,
    demo: null,
    client: 'IBMH Conseils',
    visuel: {
      type: 'chaine',
      retrait: true,
      titre: 'Organisation d’un client Celsius',
      etapes: [
        ['Client', 'par exemple un groupe hospitalier'],
        ['Site', 'plusieurs par client'],
        ['Bâtiment', ''],
        ['Étage', ''],
        ['Local', 'frigo, congélateur, chambre froide'],
      ],
    },
  },
  {
    id: 'medicalrisk',
    secteur: 'Santé',
    discipline: 'Data science',
    nom: 'MedicalRiskAPI',
    question: 'Servir un score de risque médical en aide à la décision.',
    probleme: 'Donner au soignant un score de risque exploitable.',
    approche: 'Un modèle de machine learning servi par une API Flask.',
    resultat: 'Un score renvoyé à la demande ; la décision reste humaine.',
    pile: 'Machine learning, Flask',
    depot: null, // TODO : URL du dépôt
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Service MedicalRiskAPI',
      etapes: [
        ['Données patient', 'requête à l’API'],
        ['Modèle de risque', 'machine learning'],
        ['API Flask', 'score renvoyé'],
        ['Décision', 'reste au soignant'],
      ],
    },
  },

  // ---------- E-commerce ----------
  {
    id: 'reco',
    secteur: 'E-commerce',
    discipline: 'Data science',
    nom: 'Recommandation produit',
    question: 'Quels dix produits montrer pendant la visite ?',
    probleme: 'Montrer, pendant la visite, des produits que le client n’aurait pas trouvés seul.',
    approche: 'Candidats par co-visitation, reclassés par un ranker LightGBM à deux étages.',
    resultat: '30,6 % de hit@10 sur le test, +4,3 pts face à la co-visitation.',
    mesure: { valeur: '30,6 %', unite: 'hit@10 sur le test' },
    pile: 'LightGBM LambdaRank, FastAPI, Docker',
    depot: null, // TODO : URL du dépôt quand il sera créé
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'barres',
      titre: 'hit@10 sur le test, RetailRocket, 14 jours',
      max: 35,
      barres: [
        ['Popularité globale', 0.6, '0,6 %'],
        ['ALS', 3.7, '3,7 %'],
        ['Populaires de la catégorie', 13.6, '13,6 %'],
        ['Co-visitation', 26.3, '26,3 %'],
        ['Ranker LightGBM', 30.6, '30,6 %', true],
      ],
    },
  },
  {
    id: 'pricing',
    secteur: 'E-commerce',
    discipline: 'Data science',
    nom: 'Prix d’une marketplace',
    question: 'De combien la demande suit-elle le prix ?',
    probleme: 'Savoir si les prix d’Olist laissent de la marge sur la table.',
    approche: 'Six estimateurs de l’élasticité ; référence en effets fixes produit × mois.',
    resultat: 'Élasticité de −0,75 : des prix sous l’optimum, livrés comme plan de test A/B.',
    mesure: { valeur: '−0,75', unite: 'élasticité-prix retenue' },
    pile: 'Économétrie, DoubleML, MLflow',
    depot: `${GH}/Dynamic-Pricing`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'points',
      titre: 'Élasticité-prix selon l’estimateur, Olist',
      min: -2,
      max: 0,
      graduations: [[-2, '−2,0'], [-1.5, '−1,5'], [-1, '−1,0'], [-0.5, '−0,5'], [0, '0']],
      points: [
        ['OLS poolée', -0.02, '−0,02'],
        ['Effets fixes catégorie', -0.02, '−0,02'],
        ['DoubleML naïf', -0.12, '−0,12'],
        ['DoubleML après absorption', -0.73, '−0,73'],
        ['Effets fixes produit × mois', -0.75, '−0,75', true],
        ['Poisson PPML, best-sellers', -1.81, '−1,81'],
      ],
    },
  },
  {
    id: 'uplift',
    secteur: 'E-commerce',
    discipline: 'Data science',
    nom: 'Ciblage d’un e-mail',
    question: 'Pour qui l’e-mail change-t-il vraiment quelque chose ?',
    probleme: 'Ne plus écrire à ceux qui achèteraient de toute façon.',
    approche: 'Uplift modeling, T-learner et X-learner, sur un essai randomisé de 64 000 clients.',
    resultat: '+0,55 pt de visites à 10 % du budget : environ deux fois plus de visites par e-mail.',
    mesure: { valeur: '+0,55 pt', unite: 'de visites, budget de 10 %' },
    pile: 'Uplift, T-learner, X-learner, FastAPI',
    depot: null, // TODO : URL du dépôt quand il sera créé
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'barres',
      titre: 'Effet de l’e-mail sur le taux de visite, en points',
      max: 14,
      barres: [
        ['E-mail femme', 4.5, '+4,5'],
        ['E-mail homme', 7.7, '+7,7'],
        ['Homme, clients des deux collections', 12.2, '+12,2', true],
      ],
    },
  },

  // ---------- Banque et finance ----------
  {
    id: 'churn',
    secteur: 'Banque et finance',
    discipline: 'Data science',
    nom: 'Attrition bancaire',
    question: 'Quels clients vont partir, et pourquoi ?',
    probleme: 'Repérer les clients sur le départ assez tôt pour les retenir.',
    approche: 'Random Forest, lecture SHAP des causes : âge, inactivité, nombre de produits.',
    resultat: '7 départs sur 10 repérés au seuil de 0,5, avec une précision de 54,3 %.',
    mesure: { valeur: '71 %', unite: 'des départs détectés' },
    pile: 'Random Forest, SHAP, FastAPI, Docker',
    depot: `${GH}/Churn-Prediction`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'barres',
      titre: 'Évaluation au seuil de 0,5',
      max: 100,
      barres: [
        ['Exactitude', 82, '82 %'],
        ['Rappel, départs détectés', 71, '71 %', true],
        ['Précision', 54.3, '54,3 %'],
      ],
    },
  },

  // ---------- Grande distribution ----------
  {
    id: 'demande',
    secteur: 'Grande distribution',
    discipline: 'Data science',
    nom: 'Demande par magasin',
    question: 'D’où viennent les creux, et combien commander ?',
    probleme: 'Expliquer les creux de demande et commander juste.',
    approche: 'XGBoost sur 3 ans de ventes, validé sur 4 périodes, puis simulation de stock.',
    resultat: '−36 % de ruptures en simulation ; chaque creux coïncide avec une épidémie.',
    mesure: { valeur: '−36 %', unite: 'de ruptures, en simulation' },
    pile: 'XGBoost, Optuna, FastAPI, Streamlit',
    depot: `${GH}/Pr-diction-Demand`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'barres',
      titre: 'Erreur absolue moyenne, validation walk-forward',
      max: 35,
      barres: [
        ['Pli 1, février à mai 2023', 23.64, '23,6'],
        ['Pli 2, mai à août 2023', 29.0, '29,0'],
        ['Pli 3, août à novembre 2023', 25.84, '25,8'],
        ['Pli 4, novembre 2023 à janvier 2024', 26.59, '26,6'],
        ['Moyenne', 26.27, '26,3', true],
      ],
    },
  },


  // ---------- IA générative ----------
  {
    id: 'rag',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'Assistant RAG personnel',
    question: 'Répondre sur mon parcours, à partir de mes documents.',
    probleme: 'Répondre aux recruteurs sur mon parcours, à toute heure.',
    approche: 'RAG sur mon CV et mes documents, Amazon Nova 2 Lite via Bedrock, mémoire sur S3.',
    resultat: 'Déployé sur AWS Lambda, puis porté sur GCP et Azure.',
    mesure: { valeur: '3', unite: 'clouds : AWS, GCP, Azure' },
    pile: 'Bedrock, Lambda, S3, Docker, IAM',
    depot: `${GH}/digital-twin`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Architecture de l’assistant RAG',
      etapes: [
        ['Sources', 'CV et documents collectés'],
        ['Génération', 'Amazon Nova 2 Lite via Bedrock'],
        ['Service', 'Docker sur ECR, AWS Lambda'],
        ['Mémoire', 'conversations stockées sur S3'],
        ['Portage', 'Cloud Run, Container Apps'],
      ],
    },
  },
  {
    id: 'studio',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'Studio IA multimodal',
    question: 'Réunir la voix, les documents et la prévision dans une seule application.',
    probleme: 'Tester plusieurs usages de l’IA au même endroit : transcrire, interroger un document, parler, prévoir.',
    approche: 'Whisper, RAG avec ChromaDB, synthèse vocale, LSTM et Chronos commentés par Gemini, réseau de neurones Keras.',
    resultat: 'Une application Streamlit en quatre pages, suivie dans LangSmith, et des modèles de prédiction en notebooks.',
    mesure: { valeur: '4', unite: 'outils dans une même application' },
    pile: 'Streamlit, Whisper, ChromaDB, Keras, Gemini, LangSmith',
    depot: `${GH}/SN_NLP`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Les briques du studio',
      etapes: [
        ['Audio vers texte', 'Whisper'],
        ['Questions sur un PDF', 'RAG, ChromaDB'],
        ['Texte vers voix', 'modèle Hugging Face'],
        ['Chatbot boursier', 'LSTM ou Chronos, Gemini'],
        ['Prix des logements', 'réseau de neurones Keras'],
        ['Interface et suivi', 'Streamlit, LangSmith'],
      ],
    },
  },
  {
    id: 'semantic',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'SemanticSearchAPI',
    question: 'Chercher par le sens, pas par les mots.',
    probleme: 'Trouver un document par son sens, pas par ses mots.',
    approche: 'Embeddings et recherche des plus proches voisins, servis par une API.',
    resultat: 'Des résultats classés par pertinence.',
    pile: 'Embeddings, API',
    depot: null, // TODO : URL du dépôt
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Recherche sémantique',
      etapes: [
        ['Requête', 'en langage naturel'],
        ['Embedding', 'vecteur de sens'],
        ['Voisins', 'les plus proches'],
        ['Résultats', 'classés par pertinence'],
      ],
    },
  },
];

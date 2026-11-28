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
  'IA générative',
  'Santé',
  'Grande distribution',
  'E-commerce',
  'Banque et finance',
];

const GH = 'https://github.com/Loscope29';

export const projets = [
  // ---------- Santé ----------
  {
    id: 'fireprotect',
    secteur: 'Santé',
    discipline: 'IoT et cloud',
    nom: 'FireProtect',
    question: 'Détecter un départ de feu, sur une plateforme hébergée en local.',
    probleme: 'Alerter vite, sans fausse alarme, sans confier les données de plusieurs clients à un service tiers.',
    approche: 'Capteurs LoRaWAN, détection confirmée par plusieurs capteurs, serveur hébergé en local, clients isolés dans la base.',
    resultat: 'En production chez IBMH Conseils : alarmes et sirènes déclenchées sans intervention, données gardées sur un serveur maîtrisé.',
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
        ['Données', 'hébergées en local, isolées par client'],
        ['Action', 'sirènes, relais, notifications'],
      ],
    },
  },
  {
    id: 'celsius',
    secteur: 'Santé',
    discipline: 'IoT et cloud',
    nom: 'Celsius',
    question: 'Surveiller la chaîne du froid en continu, données hébergées en local.',
    probleme: 'Remplacer les relevés de température à la main par une surveillance continue, sans sortir les données des clients.',
    approche: 'Capteurs LoRaWAN, organisation client, site, bâtiment, local, alertes de seuil automatiques, déploiement en local.',
    resultat: 'En production chez IBMH Conseils, pour des clients répartis sur plusieurs sites, chacun isolé des autres.',
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

  // ---------- E-commerce ----------
  {
    id: 'reco',
    secteur: 'E-commerce',
    discipline: 'Data science',
    nom: 'Recommandation produit',
    question: 'Quels dix produits montrer pendant la visite ?',
    probleme: 'Montrer, pendant la visite, des produits que le client n’aurait pas trouvés seul.',
    approche: 'Candidats par co-visitation, reclassés par un ranker LightGBM à deux étages.',
    resultat: '30,6 % de hit@10 sur le test : +4,3 pts mesurés face à la meilleure référence.',
    mesure: { valeur: '30,6 %', unite: 'hit@10 sur le test' },
    pile: 'LightGBM LambdaRank, FastAPI, Docker',
    depot: `${GH}/Recommendation-Systems`,
    demo: 'https://recommendation-systems-chzmdyviq75swcpcuxr7ez.streamlit.app/',
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
    demo: 'https://dynamic-pricing-tdmmvcuaj4msux7rkf3gxa.streamlit.app/',
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
    depot: `${GH}/Causal-Inference`,
    demo: 'https://causal-inference-xec72mccv2kqfcxsrbblrj.streamlit.app/',
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
    approche: 'Random Forest optimisé avec Optuna, seuil fixé par le coût des erreurs, causes lues avec SHAP.',
    resultat: '82,3 % des départs détectés, ROC-AUC de 0,860, et un gain chiffré : +82 900 € d’impact net estimé.',
    mesure: { valeur: '82,3 %', unite: 'des départs détectés' },
    pile: 'Random Forest, Optuna, SHAP, FastAPI, Streamlit, Docker',
    depot: `${GH}/Churn-Prediction`,
    demo: 'https://churn-prediction-7c6wdutxukuzfcfkptnwwv.streamlit.app/',
    visuel: {
      type: 'barres',
      titre: 'Départs détectés selon le seuil de décision',
      max: 100,
      barres: [
        ['Seuil standard, 0,5', 71, '71 %'],
        ['Seuil optimisé par les coûts, 0,371', 82.31, '82,3 %', true],
      ],
    },
  },

  // ---------- Grande distribution ----------
  {
    id: 'demande',
    secteur: 'Grande distribution',
    discipline: 'Data science',
    nom: 'Demande par magasin',
    question: 'Combien commander, catégorie par région ?',
    probleme: 'Automatiser la commande : une rupture coûte une vente, un surplus immobilise du stock.',
    approche: 'XGBoost validé sur 4 périodes, puis une règle de commande qui arbitre entre rupture et surstock.',
    resultat: 'Gain mesuré face à la règle actuelle : −14,6 % de coût total simulé, rupture ramenée de 25,9 % à 11,9 %.',
    mesure: { valeur: '−14,6 %', unite: 'de coût total, en simulation' },
    pile: 'XGBoost, Optuna, FastAPI, Streamlit, Docker',
    depot: `${GH}/Pr-diction-Demand`,
    demo: 'https://pr-diction-demand-jm6e7ymmnauhlg4ur8pjce.streamlit.app/',
    visuel: {
      type: 'barres',
      titre: 'Taux de rupture simulé sur 360 jours de test',
      max: 30,
      barres: [
        ['Règle actuelle, prévision × 1,20', 25.9, '25,9 %'],
        ['Règle recommandée, prévision × 1,39', 11.9, '11,9 %', true],
      ],
    },
  },


  // ---------- IA générative ----------
  {
    id: 'rag',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'Assistant RAG en ligne',
    question: 'Répondre à partir d’une base de documents, à toute heure.',
    probleme: 'Rendre une base de documents interrogeable en langage naturel, sans relire chaque fichier.',
    approche: 'Collecte et indexation des documents, recherche des passages utiles, réponse générée par Amazon Nova 2 Lite via Bedrock.',
    resultat: 'En ligne sur AWS Lambda, accès gérés avec IAM et coûts sous alerte, puis porté sur GCP et Azure.',
    mesure: { valeur: '3', unite: 'clouds : AWS, GCP, Azure' },
    pile: 'Bedrock, Lambda, S3, Docker, IAM',
    depot: `${GH}/digital-twin`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Architecture de l’assistant RAG',
      etapes: [
        ['Sources', 'documents collectés et indexés'],
        ['Génération', 'Amazon Nova 2 Lite via Bedrock'],
        ['Service', 'Docker sur ECR, AWS Lambda'],
        ['Mémoire', 'conversations stockées sur S3'],
        ['Portage', 'Cloud Run, Container Apps'],
      ],
    },
  },
  {
    id: 'polymind',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'Polymind',
    question: 'Transcrire, interroger un PDF, résumer : des tâches répétitives dans une seule application.',
    probleme: 'Rassembler au même endroit des tâches répétitives : transcrire un audio, interroger un PDF, commenter une prévision.',
    approche: 'Transcription Whisper, RAG avec LangChain, ChromaDB et Gemini, et chaque appel au LLM tracé dans LangSmith.',
    resultat: 'Une application Streamlit en quatre outils, suivie dans LangSmith (latence, jetons) et livrée en image Docker.',
    mesure: { valeur: '4', unite: 'outils dans une même application' },
    pile: 'Streamlit, Whisper, LangChain, ChromaDB, Gemini, Chronos, Keras, LangSmith, Docker',
    depot: `${GH}/polymind`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Les briques de Polymind',
      etapes: [
        ['Audio vers texte', 'Whisper'],
        ['Texte vers voix', 'MMS-TTS, Hugging Face'],
        ['Questions sur un PDF', 'LangChain, ChromaDB, Gemini'],
        ['Chatbot boursier', 'Chronos ou LSTM, Gemini'],
        ['Prix des logements', 'réseau de neurones Keras'],
        ['Suivi et livraison', 'LangSmith, Docker'],
      ],
    },
  },
  {
    id: 'semantic',
    secteur: 'IA générative',
    discipline: 'IA générative',
    nom: 'SemanticSearchAPI',
    question: 'Une base de documents interrogeable par le sens, qui tourne en local.',
    probleme: 'Retrouver un passage dans une pile de PDF sans connaître les mots exacts, ni envoyer les documents à un service tiers.',
    approche: 'Extraction, découpage et indexation des PDF ; embeddings Sentence-Transformers calculés sur la machine, stockés dans PostgreSQL et pgvector.',
    resultat: 'Une API Django REST sans appel à un service externe : elle indexe des PDF, cherche par similarité et propose des documents proches.',
    mesure: { valeur: '4', unite: 'routes d’API documentées' },
    pile: 'Django REST Framework, Sentence-Transformers, pgvector, PostgreSQL, PyMuPDF',
    depot: `${GH}/SemanticSearchAPI`,
    demo: null, // TODO : URL de la démo en ligne
    visuel: {
      type: 'chaine',
      titre: 'Du PDF à la recherche sémantique',
      etapes: [
        ['PDF', 'téléversé par l’API'],
        ['Extraction du texte', 'PyMuPDF'],
        ['Découpage', 'en segments'],
        ['Embeddings', 'Sentence-Transformers, MiniLM'],
        ['Stockage', 'PostgreSQL et pgvector'],
        ['Recherche', 'similarité cosinus'],
      ],
    },
  },
];

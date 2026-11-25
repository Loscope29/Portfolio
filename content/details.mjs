// Contenu des pages de détail, une entrée par projet (clé = id du projet dans projets.mjs).
// Tous les champs sont facultatifs : une section vide n'apparaît pas sur la page.
//
//   contexte    un ou deux paragraphes : la situation et l'enjeu
//   donnees     d'où viennent les données et ce qu'elles contiennent
//   source      [nom du jeu de données, lien] : affiché sous les données
//   etapes      la démarche, dans l'ordre
//   resultats   [valeur, ce qu'elle mesure] : uniquement des chiffres réels
//   limites     ce que le projet ne prouve pas encore, ou ses hypothèses

export const details = {
  fireprotect: {
    contexte: [
      'Une plateforme de supervision incendie pour plusieurs clients : détection d’un départ de feu et alertes techniques (batterie, communication) à partir de capteurs LoRaWAN.',
      'Quand un incendie est confirmé, la plateforme déclenche les actionneurs (sirènes, relais) et prévient les équipes concernées.',
    ],
    donnees: 'Les trames radio des capteurs : fumée, déclencheur manuel, niveau de batterie et qualité du signal, stockées en séries temporelles.',
    etapes: [
      'Réseau LoRaWAN avec ChirpStack et transmission des trames par MQTT.',
      'Ingestion et détection dans Django : un incendie est confirmé par plusieurs capteurs avant de déclencher l’alarme.',
      'PostgreSQL et TimescaleDB, chaque client isolé par Row-Level Security au niveau de la base.',
      'Interfaces Next.js à trois niveaux : plateforme, client et site.',
      'Serveur de production sécurisé, conteneurs Docker, HTTPS par Traefik, CI/CD GitHub Actions.',
      'Supervision de l’infrastructure avec Prometheus et Grafana.',
    ],
    resultats: [
      ['3', 'niveaux d’interface : plateforme, client, site'],
      ['RLS', 'isolation des clients dans la base, pas seulement dans le code'],
    ],
  },

  celsius: {
    contexte: [
      'La surveillance de la chaîne du froid (réfrigérateurs, congélateurs, chambres froides) par capteurs LoRaWAN, pour des clients qui ont chacun plusieurs sites, par exemple un groupe hospitalier.',
      'Tous les clients partagent une instance et une base, et leurs données restent séparées.',
    ],
    donnees: 'Les relevés de température des capteurs, rangés par client, site, bâtiment, étage et local.',
    etapes: [
      'Pont entre ChirpStack et la plateforme pour recevoir les relevés des capteurs.',
      'Serveur multi-clients et interface web, alertes sur dépassement de seuil.',
      'Tests du pont, de l’isolation entre clients et de bout en bout.',
      'Déploiement en conteneurs Docker, CI et déploiement automatisés avec GitHub Actions.',
    ],
    resultats: [
      ['5', 'niveaux d’organisation : client, site, bâtiment, étage, local'],
    ],
  },

  reco: {
    contexte: [
      'Le bloc « Vous aimerez aussi » : pendant qu’un visiteur navigue, quels dix produits lui montrer pour qu’il trouve, et mette au panier, un produit qu’il n’aurait pas trouvé seul ?',
    ],
    source: ['RetailRocket e-commerce dataset, Kaggle', 'https://www.kaggle.com/datasets/retailrocket/ecommerce-dataset'],
    donnees: 'Le jeu de données e-commerce RetailRocket : consultations, mises au panier et achats. 71 % des visiteurs n’ont qu’un seul événement, d’où une recommandation par session plutôt que par profil.',
    etapes: [
      'Qualité des données et nettoyage, dont le retrait de 129 comptes à très fort volume.',
      'Protocole temporel : historique, validation sur 14 jours, puis test sur les 14 derniers jours, lu une seule fois.',
      'Références : popularité globale, populaires de la catégorie, factorisation ALS.',
      'Cinquante candidats par co-visitation et par catégorie, reclassés par un ranker LightGBM LambdaRank à 21 variables.',
      'Simulation de l’impact sur les achats.',
      'API FastAPI, tableau de bord Streamlit, Docker, CI/CD et réentraînement CML.',
    ],
    resultats: [
      ['30,6 %', 'hit@10 sur le test, contre 26,3 % pour la co-visitation'],
      ['+4,3 pts', 'face à la co-visitation, IC 95 % de 4,0 à 4,6'],
      ['+0,84 %', 'd’achats simulés face à la règle de catégorie'],
      ['50 ms', 'de latence médiane par requête'],
    ],
    limites: [
      'Le gain réel dépend de l’incrémentalité, que seul un A/B test mesurera, au niveau du bloc.',
      'La factorisation ALS fait quatre fois moins bien qu’une règle métier : trop peu d’historique par visiteur.',
      'Le bon produit n’est parmi les 50 candidats que dans 41 % des cas : c’est le premier levier d’amélioration.',
    ],
  },

  pricing: {
    contexte: [
      'Optimiser un prix suppose de connaître l’élasticité-prix de la demande. Sur des données de ventes, elle est biaisée : un vendeur monte son prix quand il attend une forte demande, et solde quand elle faiblit.',
    ],
    source: ['Brazilian E-Commerce Public Dataset by Olist, Kaggle', 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce'],
    donnees: 'Les ventes de la marketplace brésilienne Olist, regroupées en panel produit par mois. 1 % seulement de la variance du prix vient d’un même produit dont le prix change.',
    etapes: [
      'Exploration : ces données permettent-elles de faire du pricing ?',
      'Construction du panel, au grain produit par mois.',
      'Six estimateurs de l’élasticité, validés sur données simulées.',
      'Modèle de demande LightGBM contraint à décroître avec le prix, suivi dans MLflow.',
      'Optimisation par la règle de Lerner, avec un garde-fou de ±25 % sur le prix.',
      'API FastAPI de 10 routes, tableau de bord en 4 onglets, 72 tests et CI/CD.',
    ],
    resultats: [
      ['−0,75', 'élasticité retenue, effets fixes produit par mois'],
      ['−0,73', 'confirmée par DoubleML après absorption des effets fixes'],
      ['−1,81', 'pour les 600 meilleures ventes, nettement plus élastiques'],
      ['1 %', 'de la variance du prix vient de vraies décisions de prix'],
    ],
    limites: [
      '85 % des produits butent sur le garde-fou de ±25 % : leur optimum sort des prix jamais observés.',
      'Aucun coût réel n’est publié par Olist : le gain affiché est auto-évalué. D’où un plan de test A/B séquencé plutôt qu’une hausse générale.',
      'L’élasticité mesurée est de court terme : elle ne capte ni la réponse des concurrents, ni un repositionnement durable.',
    ],
  },

  uplift: {
    contexte: [
      'Mesurer l’effet causal d’une campagne e-mail, puis décider qui doit la recevoir. La question n’est pas « qui va visiter le site ? », mais « pour qui l’e-mail change-t-il quelque chose ? ».',
    ],
    source: ['MineThatData E-Mail Analytics Challenge, Kevin Hillstrom', 'http://www.minethatdata.com/'],
    donnees: 'Un essai randomisé de 64 000 clients, le jeu MineThatData de Kevin Hillstrom (2008).',
    etapes: [
      'Nettoyage et contrôle de la randomisation.',
      'Politiques de référence, estimateur IPW et courbes de Qini.',
      'T-learner, X-learner et gradient boosting, réglés par validation croisée.',
      'Évaluation unique sur le test, avec un critère choisi à l’avance.',
      'Simulation de l’impact économique et analyse de sensibilité.',
      'API FastAPI, application Streamlit, 28 tests.',
    ],
    resultats: [
      ['+7,7 pts', 'de visites avec l’e-mail homme, pour une base de 10,6 %'],
      ['+0,55 pt', 'de visites à 10 % du budget, IC 95 % de +0,23 à +0,86'],
      ['×2', 'environ, de visites par e-mail envoyé'],
      ['+12,2 pts', 'pour les clients des deux collections'],
    ],
    limites: [
      'Si l’envoi est gratuit, aucune règle de ciblage ne bat l’envoi à tous.',
      'Cibler n’est rentable que si le coût d’un e-mail rapporté à la valeur d’une visite se situe entre 0,075 et 0,12 environ.',
      'Une seule campagne, en 2008 : l’effet d’un e-mail aujourd’hui peut être plus faible.',
    ],
  },

  churn: {
    contexte: [
      'Une banque perd des clients sans les voir partir. L’objectif métier : réduire le départ des clients à risque de 25 %, en les repérant assez tôt pour agir avant la résiliation.',
      'Les deux erreurs n’ont pas le même prix : manquer un départ coûte bien plus cher qu’une relance inutile. Le seuil de décision en tient compte.',
    ],
    donnees: 'Des données de clients bancaires : score de crédit, pays, âge, ancienneté, solde, nombre de produits, statut de membre actif.',
    etapes: [
      'Exploration et nettoyage des données.',
      'Pipeline scikit-learn et Random Forest, réglage des hyperparamètres avec Optuna.',
      'Seuil de décision fixé à 0,371 en minimisant le coût des erreurs : 50 € pour une relance inutile, 360 € pour un départ manqué.',
      'Lecture des causes de départ avec SHAP, et rapport décisionnel pour la direction.',
      'API FastAPI validée par Pydantic et tableau de bord Streamlit, avec import CSV par lot.',
      'Docker Compose, 9 tests Pytest, CI/CD GitHub Actions, images publiées sur Docker Hub et rapport CML.',
    ],
    resultats: [
      ['82,3 %', 'des départs détectés, au seuil de 0,371'],
      ['0,860', 'de ROC-AUC'],
      ['+82 900 €', 'd’impact net estimé sur le jeu d’évaluation'],
      ['9', 'tests unitaires et d’intégration'],
    ],
    limites: [
      'L’impact financier dépend des coûts unitaires retenus (50 € et 360 €), qui restent à valider avec le métier.',
      'Atteindre −25 % de départs supposerait de retenir environ 35 % des clients détectés, une hypothèse à valider sur le terrain.',
    ],
  },

  demande: {
    contexte: [
      'Mal anticiper la demande coûte deux fois : une rupture fait perdre une vente, un surstock immobilise du capital. Et les deux erreurs n’ont pas le même coût.',
      'Le projet produit une prévision journalière par catégorie et par région, puis une règle de commande qui arbitre entre ces deux coûts.',
    ],
    donnees: 'La demande quotidienne par magasin, catégorie et région, avec le prix, les promotions, la météo, la saisonnalité et les périodes d’épidémie.',
    etapes: [
      'Nettoyage, exploration et analyse des creux de demande.',
      'Variables de décalage (1, 7 et 14 jours), moyennes mobiles et écart de prix.',
      'Référence naïve, puis XGBoost réglé avec Optuna.',
      'Validation walk-forward sur 4 périodes de 90 jours.',
      'Règle de commande : la prévision multipliée par le coefficient qui minimise le coût, avec 15 € par unité manquante et 2 € par unité en trop.',
      'API FastAPI avec un simulateur de coûts, tableau de bord Streamlit, Docker, CI et rapport CML.',
    ],
    resultats: [
      ['−14,6 %', 'de coût total simulé : 4,17 M€ contre 4,89 M€'],
      ['11,9 %', 'de taux de rupture, contre 25,9 % avec la règle actuelle'],
      ['−19 %', 'd’erreur face à la demande de la veille (MAE 26,3 contre 32,3)'],
    ],
    limites: [
      'Les montants dépendent des deux coûts unitaires (15 € et 2 €), qui restent à valider : le simulateur recalcule tout pour d’autres valeurs.',
      'Le modèle utilise la demande de la veille : sa précision pour une commande passée 3 jours à l’avance reste à mesurer.',
    ],
  },

  rag: {
    contexte: [
      'Un assistant qui répond aux recruteurs sur mon parcours, à toute heure, à partir de mon CV et d’autres documents.',
    ],
    donnees: 'Mon CV et des documents collectés par scraping.',
    etapes: [
      'Collecte des documents et recherche des passages pertinents (RAG).',
      'Génération des réponses avec Amazon Nova 2 Lite via Amazon Bedrock, et avec l’API OpenAI.',
      'Mémoire des conversations conservée sur S3.',
      'Image Docker sur ECR, exécution sur AWS Lambda, interface statique sur S3.',
      'Accès gérés avec IAM, alertes de facturation pour maîtriser les coûts.',
      'Portage sur GCP (Cloud Run) et sur Azure (Container Apps).',
    ],
    resultats: [
      ['3', 'clouds : AWS, GCP et Azure'],
    ],
  },

  polymind: {
    contexte: [
      'Polymind réunit quatre outils d’IA appliquée derrière une seule interface Streamlit : la voix, les documents et la finance.',
      'Chaque appel aux LLM est tracé dans LangSmith : latence, jetons, enchaînement des étapes.',
    ],
    donnees: 'Les fichiers audio et PDF fournis par l’utilisateur, et dix ans de cours de quatre actions cotées, récupérés avec yfinance.',
    etapes: [
      'Transcription d’un fichier audio avec Whisper.',
      'Synthèse vocale en français avec MMS-TTS (VITS), via Hugging Face.',
      'Questions sur un PDF : découpage, embeddings MiniLM, recherche dans ChromaDB, réponse de Gemini 2.5 Flash.',
      'Chatbot boursier : prévision sur six mois par Chronos sans entraînement, ou par un LSTM entraîné sur dix ans, commentée par Gemini.',
      'Estimation du prix d’un logement avec un réseau de neurones Keras.',
      'Image Docker avec healthcheck, prête pour Cloud Run, Container Apps ou Streamlit Community Cloud.',
    ],
    resultats: [
      ['4', 'outils dans une même application : audio, voix, PDF, bourse'],
      ['6 mois', 'de prévision de cours, commentée par Gemini'],
      ['10 ans', 'd’historique pour entraîner les LSTM'],
    ],
    limites: [
      'Projet pédagogique : les prévisions de cours ne sont pas un conseil en investissement.',
      'Whisper, Chronos et TensorFlow tiennent en mémoire : il faut au moins 4 Go de RAM pour l’héberger.',
    ],
  },

  semantic: {
    contexte: [
      'Un projet de master : une API de recherche sémantique qui indexe des documents PDF et répond selon le sens de la question, plutôt que sur des mots-clés.',
    ],
    donnees: 'Les documents PDF téléversés par l’utilisateur.',
    etapes: [
      'Téléversement d’un PDF par l’API et extraction de son texte avec PyMuPDF.',
      'Découpage du texte en segments, pour gagner en précision.',
      'Calcul d’un embedding par segment avec Sentence-Transformers (MiniLM).',
      'Stockage dans PostgreSQL avec pgvector, et un index ivfflat pour accélérer la recherche.',
      'Recherche par similarité cosinus, documents similaires et historique des recherches.',
      'API Django REST Framework documentée avec Swagger.',
    ],
    resultats: [
      ['4', 'routes : téléversement, recherche, documents similaires, historique'],
      ['ivfflat', 'index vectoriel pgvector pour accélérer la recherche'],
    ],
    limites: [
      'Les PDF scannés ne sont pas encore lus : il faudrait un OCR.',
      'Seul le format PDF est pris en charge pour l’instant.',
    ],
  },

};

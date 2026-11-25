// Contenu des pages de détail, une entrée par projet (clé = id du projet dans projets.mjs).
// Tous les champs sont facultatifs : une section vide n'apparaît pas sur la page.
//
//   contexte    un ou deux paragraphes : la situation et l'enjeu
//   donnees     d'où viennent les données et ce qu'elles contiennent
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

  diabete: {
    donnees: 'Les indicateurs de santé de l’enquête BRFSS 2015.',
    etapes: [
      'Préparation des indicateurs de santé.',
      'Entraînement d’un réseau de neurones avec Keras.',
      'Estimation d’un risque de diabète par personne.',
    ],
  },

  reco: {
    contexte: [
      'Le bloc « Vous aimerez aussi » : pendant qu’un visiteur navigue, quels dix produits lui montrer pour qu’il trouve, et mette au panier, un produit qu’il n’aurait pas trouvé seul ?',
    ],
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
    ],
  },

  pricing: {
    contexte: [
      'Optimiser un prix suppose de connaître l’élasticité-prix de la demande. Sur des données de ventes, elle est biaisée : un vendeur monte son prix quand il attend une forte demande, et solde quand elle faiblit.',
    ],
    donnees: 'Les ventes de la marketplace brésilienne Olist, regroupées en panel produit par mois. 1 % seulement de la variance du prix vient d’un même produit dont le prix change.',
    etapes: [
      'Exploration : ces données permettent-elles de faire du pricing ?',
      'Construction du panel, au grain produit par mois.',
      'Six estimateurs de l’élasticité, validés sur données simulées.',
      'Modèle de demande avec contrainte de monotonie, suivi dans MLflow.',
      'Optimisation par la règle de Lerner, avec un garde-fou de ±25 % sur le prix.',
      'API FastAPI, tableau de bord, 72 tests et CI/CD.',
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
    ],
  },

  uplift: {
    contexte: [
      'Mesurer l’effet causal d’une campagne e-mail, puis décider qui doit la recevoir. La question n’est pas « qui va visiter le site ? », mais « pour qui l’e-mail change-t-il quelque chose ? ».',
    ],
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
    ],
  },

  churn: {
    contexte: [
      'Une banque perd des clients sans les voir partir. L’objectif métier : réduire le départ des clients à risque de 25 %, en les repérant assez tôt pour agir avant la résiliation.',
    ],
    donnees: 'Des données de clients bancaires : âge, pays de résidence, solde, nombre de produits et statut de membre actif.',
    etapes: [
      'Exploration et nettoyage des données.',
      'Pipeline scikit-learn et Random Forest, réglage des hyperparamètres avec Optuna.',
      'Lecture des causes de départ avec SHAP.',
      'API FastAPI validée par Pydantic et tableau de bord Streamlit.',
      'Docker Compose, tests pytest, CI/CD GitHub Actions et rapport CML.',
    ],
    resultats: [
      ['71 %', 'des départs détectés, au seuil de 0,5'],
      ['54,3 %', 'de précision'],
      ['82 %', 'd’exactitude'],
      ['3', 'signaux de départ en tête : âge, inactivité, nombre de produits'],
    ],
    limites: [
      'Atteindre −25 % de départs supposerait de retenir environ 35 % des clients détectés, une hypothèse à valider sur le terrain.',
      'L’AUC sera publiée une fois recalculée sur un jeu de test isolé.',
    ],
  },

  bourse: {
    contexte: [
      'Rendre lisibles des prévisions de cours : l’utilisateur choisit une entreprise et un modèle, pose sa question, et un LLM répond à partir des prévisions.',
    ],
    donnees: 'Les cours de quatre actions cotées, récupérés avec yfinance.',
    etapes: [
      'Prévision des cours avec un LSTM entraîné en local, ou avec Chronos via Hugging Face.',
      'Rédaction de la réponse par Gemini, à partir des prévisions.',
      'Interface Streamlit.',
    ],
    limites: [
      'Au-delà de 64 jours, les prévisions de Chronos perdent en qualité.',
    ],
  },

  demande: {
    contexte: [
      'Trois ans de demande journalière, avec des creux récurrents que personne n’expliquait. Mal anticiper la demande coûte deux fois : en ruptures de stock et en surstock.',
    ],
    donnees: 'La demande quotidienne par magasin, catégorie et région, avec le prix, les promotions, la météo, la saisonnalité et les périodes d’épidémie.',
    etapes: [
      'Nettoyage, exploration et analyse des creux de demande.',
      'Variables de décalage (1, 7 et 14 jours), moyennes mobiles et écart de prix.',
      'Référence naïve, puis XGBoost réglé avec Optuna.',
      'Validation walk-forward sur 4 périodes successives.',
      'Simulation d’une politique de stock : stock de sécurité de 20 %, délai de livraison de 3 jours.',
      'API FastAPI, tableau de bord Streamlit, Docker et CI.',
    ],
    resultats: [
      ['−36 %', 'de ruptures de stock, en simulation'],
      ['26,3', 'd’erreur absolue moyenne sur les 4 périodes'],
      ['100 %', 'des creux observés coïncident avec une période d’épidémie'],
    ],
    limites: [
      'Le gain sur les ruptures est mesuré en simulation, pas encore en conditions réelles.',
      'Une variable à risque de fuite de données a été écartée après un test de sensibilité, sans perte de précision.',
    ],
  },

  logement: {
    etapes: [
      'Préparation des caractéristiques du bien.',
      'Entraînement d’un réseau de neurones avec Keras.',
      'Estimation d’un prix de vente.',
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

  atelier: {
    contexte: [
      'Une application qui réunit quatre outils de traitement de la voix et des documents.',
    ],
    etapes: [
      'Transcription d’un fichier audio avec Whisper.',
      'Questions sur un PDF, avec une recherche de passages dans ChromaDB.',
      'Synthèse vocale avec un modèle Hugging Face.',
      'Application Streamlit en plusieurs pages, suivi des appels dans LangSmith.',
    ],
  },
};

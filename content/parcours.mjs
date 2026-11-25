// Parcours et boîte à outils de l'accueil. Le plus récent en premier.
//
// parcours :
//   quand     la période, en texte ('2026', '2024 à 2026')
//   type      'CDD', 'Stage', 'Formation'…
//   titre     le poste ou le diplôme
//   lieu      l'entreprise ou l'école, et la ville
//   missions  ce que tu as fait, une ligne par mission (facultatif)
//   tags      les outils principaux (facultatif)
//
// outils : [nom de la catégorie, icône, [[outil, logo Simple Icons facultatif], …]]
//   Le logo vient de https://simpleicons.org : mettre son identifiant (ex. 'docker'), ou rien
//   si l'outil n'y figure pas (AWS, Azure, OpenAI, XGBoost n'y sont plus).

export const parcours = [
  {
    quand: '2026',
    type: 'CDD',
    titre: 'Data engineer et AI engineer',
    lieu: 'IBMH Conseils, Nantes',
    missions: [
      'Conception et déploiement de pipelines ETL pour l’ingestion et la transformation de données métier.',
      'Intégration de modèles d’IA et de machine learning pour l’automatisation et l’aide à la décision.',
      'Assistant vocal pour conduire des entretiens de terrain : transcription, analyse et structuration des réponses.',
      'Intégration d’un LLM qui résume les échanges pour faciliter la décision.',
    ],
    tags: ['ETL', 'NLP', 'LLM', 'Python'],
  },
  {
    quand: '2026',
    type: 'Stage',
    titre: 'Plateformes IoT FireProtect et Celsius',
    lieu: 'IBMH Conseils, Nantes',
    missions: [
      'Conception, développement et déploiement en autonomie de deux plateformes IoT en production.',
      'Réseau LoRaWAN avec ChirpStack, intégration des capteurs et actionneurs, transmission par MQTT.',
      'API REST Django, interface Next.js, séries temporelles dans PostgreSQL et TimescaleDB.',
      'Serveur sécurisé, conteneurs Docker, HTTPS par Traefik, CI/CD GitHub Actions, supervision Prometheus et Grafana.',
    ],
    tags: ['LoRaWAN', 'Django', 'Next.js', 'TimescaleDB', 'Docker', 'Grafana'],
  },
  {
    quand: '2024 à 2026',
    type: 'Formation',
    titre: 'Master Data Science',
    lieu: 'Saint Jean Ingénieur, Nantes',
    missions: [
      'M1 puis M2, diplômé en 2026.',
      'En M2 : NLP, deep learning, data visualisation, data management, marketing analytique, Django et gestion de projet.',
    ],
  },
  {
    quand: '2022 à 2023',
    type: 'Formation',
    titre: 'Licence génie logiciel et BTS informatique',
    lieu: 'Instituts des Sciences, Arts et Métiers',
  },
];

export const outils = [
  ['IA et LLM', 'IA générative', [
    ['RAG'], ['Amazon Bedrock'], ['API OpenAI'], ['LangChain', 'langchain'], ['LangSmith'],
    ['Hugging Face', 'huggingface'], ['Gemini', 'googlegemini'],
  ]],
  ['Machine learning', 'graphique', [
    ['Python', 'python'], ['pandas', 'pandas'], ['scikit-learn', 'scikitlearn'], ['XGBoost'], ['LightGBM'],
    ['Keras', 'keras'], ['Optuna', 'optuna'], ['SHAP'],
  ]],
  ['Cloud', 'nuage', [
    ['AWS Lambda, S3, ECR, IAM'], ['Google Cloud Run', 'googlecloud'], ['Azure Container Apps'],
  ]],
  ['Production', 'Grande distribution', [
    ['Docker', 'docker'], ['FastAPI', 'fastapi'], ['Traefik', 'traefikproxy'], ['GitHub Actions', 'githubactions'],
    ['Prometheus', 'prometheus'], ['Grafana', 'grafana'], ['Linux', 'linux'],
  ]],
  ['Données', 'base', [
    ['PostgreSQL', 'postgresql'], ['TimescaleDB', 'timescale'], ['MLflow', 'mlflow'], ['Jupyter', 'jupyter'],
  ]],
  ['Web et IoT', 'ondes', [
    ['Django', 'django'], ['Flask', 'flask'], ['Next.js', 'nextdotjs'], ['Streamlit', 'streamlit'],
    ['MQTT', 'mqtt'], ['LoRaWAN et ChirpStack'],
  ]],
];

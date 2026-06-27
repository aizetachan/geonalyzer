// French dictionary. Mirrors the shape of the English base dictionary.

import type { Dictionary } from './en';

const fr: Dictionary = {
  nav: {
    getHelp: 'Aide',
    language: 'Langue',
  },

  landing: {
    titleBefore: 'Votre page est-elle prête pour le ',
    titleSeo: 'SEO',
    titleMid: ' et l\'',
    titleAi: 'IA',
    titleAfter: ' ?',
    subtitle:
      'Analysez n\'importe quelle URL et découvrez à quel point elle est optimisée pour le SEO classique et pour le GEO — être cité dans les réponses de ChatGPT, Claude et Perplexity.',
  },

  url: {
    placeholder: 'saisir-une-url.com',
    analyze: 'Analyser',
    analyzing: 'Analyse…',
    errorEmpty: 'Saisissez une URL à analyser.',
    errorInvalid: 'Cette URL ne semble pas valide.',
    ariaLabel: 'URL à analyser',
  },

  loading: {
    title: 'Analyse',
  },

  steps: {
    'fetch-html': 'Lecture du HTML de la page',
    'fetch-robots': 'Analyse de robots.txt',
    'fetch-sitemap': 'Vérification de sitemap.xml',
    'fetch-llms': 'Recherche de llms.txt',
    'analyze-technical': 'Évaluation du SEO technique',
    'analyze-onpage': 'Évaluation du contenu on-page',
    'analyze-schema': 'Évaluation des données structurées',
    'analyze-geo': 'Évaluation du GEO (moteurs d\'IA)',
    scoring: 'Calcul du score',
  },

  status: {
    pass: 'Correct',
    warn: 'Améliorable',
    fail: 'Échec',
    info: 'Info',
    na: 'N/A',
  },

  category: {
    technical: 'SEO technique',
    onpage: 'On-page',
    schema: 'Données structurées',
    geo: 'GEO',
    performance: 'Performance',
  },

  score: {
    critical: 'Critique',
    improvable: 'À améliorer',
    good: 'Bon',
    excellent: 'Excellent',
  },

  dashboard: {
    heroAria: 'Score global',
    heroSub:
      'Score global combinant le SEO classique et le GEO (optimisation pour les moteurs d\'IA).',
    analyzedAt: 'Analysé le {date} · via {proxy}',
    direct: 'direct',
    reanalyze: 'Ré-analyser',
    newUrl: 'Analyser une autre URL',
    warningsTitle: 'Avertissements :',
    filterShow: 'Afficher :',
    filterAll: 'Tout',
    filterFail: 'Échecs uniquement',
    filterWarn: 'Améliorables uniquement',
    filterAria: 'Filtrer les vérifications',
    categoryEmpty: 'Aucun élément ne correspond à ce filtre dans cette catégorie.',
    kpis: {
      title: 'Aperçu',
      pass: 'Réussis',
      warn: 'À améliorer',
      fail: 'En échec',
      checks: '{n} vérifications',
    },
    distribution: {
      title: 'Répartition des statuts',
    },
    ranking: {
      title: 'Catégories par impact',
      subtitle: "Les plus grandes opportunités d'abord",
      impact: 'Impact {n}',
    },
    priority: {
      title: 'Recommandations prioritaires',
      subtitle: 'Triées par poids × gravité',
      empty: 'Aucune vérification en échec ou à améliorer — excellent travail.',
      inCategory: '{category}',
    },
  },

  tour: {
    toggle: 'Aide guidée',
    close: 'Fermer',
    title: 'Aide guidée',
    hint: "Touchez n'importe quelle vérification pour comprendre ce que c'est, comment elle doit fonctionner et pourquoi elle compte.",
  },

  categoryCard: {
    lockedAria: '{label} (verrouillé)',
    lockedBody:
      'La mesure des Core Web Vitals (LCP, INP, CLS) nécessite un backend avec des données de terrain et ne peut pas s\'exécuter de façon sûre dans le navigateur.',
    proCta: 'Disponible dans la version Pro',
    scoreAria: 'Sous-score de {label}',
  },

  detail: {
    what: 'Ce que c\'est',
    found: 'Ce que nous avons trouvé',
    why: 'Pourquoi c\'est important',
    howToFix: 'Comment le corriger',
    moreInfo: 'En savoir plus ↗',
  },

  errors: {
    unknown: 'Erreur inconnue lors de l\'analyse.',
    fetchFailed:
      'Impossible de récupérer la page. Vérifiez l\'URL ou réessayez. ({detail})',
    noDetails: 'aucun détail',
  },

  warnings: {
    robots: 'Impossible de récupérer robots.txt.',
    sitemap: 'Impossible de récupérer sitemap.xml.',
  },

  msg: {
    tech: {
      https: {
        pass: 'La page est servie via HTTPS.',
        fail: 'La page n\'utilise pas HTTPS ; la connexion n\'est pas chiffrée.',
      },
      httpStatus: {
        proxy:
          'Le code HTTP n\'est pas observable à travers le proxy ; du contenu a été récupéré, donc la page répond.',
        ok: 'La page répond {status} OK.',
        other: 'La page répond {status}.',
      },
      htmlLang: {
        pass: 'Langue déclarée : "{lang}".',
        fail: 'L\'attribut lang est absent sur la balise <html>.',
      },
      viewport: {
        pass: 'Meta viewport présent ; la page est prête pour le responsive.',
        fail: 'Meta viewport absent ; la page ne s\'adaptera pas au mobile.',
      },
      canonical: {
        missing: 'Aucune balise canonical trouvée.',
        ok: 'Canonical présent et bien formé.',
        notAbsolute: 'Canonical présent mais ce n\'est pas une URL absolue valide.',
      },
      metaRobots: {
        blocks: 'Le meta robots bloque l\'indexation/le suivi ("{value}").',
        ok: 'Le meta robots ne bloque pas l\'indexation.',
      },
      robotsTxt: {
        missing: 'Impossible de récupérer /robots.txt ou il n\'existe pas.',
        valid: 'robots.txt existe et contient des directives valides.',
        invalid:
          'robots.txt existe mais ne contient aucune directive User-agent reconnaissable.',
      },
      sitemap: {
        missingRef:
          'robots.txt référence un sitemap, mais /sitemap.xml n\'a pas répondu.',
        missing: 'Aucun /sitemap.xml trouvé ni référence dans robots.txt.',
        invalid: 'sitemap.xml répond mais ne ressemble pas à un XML de sitemap valide.',
        validRef: 'sitemap.xml valide et référencé depuis robots.txt.',
        validNoRef: 'sitemap.xml valide, mais non référencé dans robots.txt.',
      },
      urlClean: {
        dirty: 'URL améliorable{reasons}.',
        clean: 'URL propre et lisible.',
        tracking: ' (paramètres de tracking)',
        depth: ' (chemin profond)',
        upper: ' (majuscules)',
      },
    },
    onpage: {
      title: {
        missing: 'Il n\'y a pas de balise <title>.',
        generic: 'Le title est générique ("{title}").',
        optimal: 'Title optimal ({len} caractères).',
        acceptable:
          'Title acceptable mais hors de la plage idéale de 50-60 ({len} caractères).',
        short: 'Title trop court ({len} caractères).',
        long: 'Title trop long ({len} caractères) ; il sera tronqué dans les résultats.',
      },
      metaDescription: {
        missing: 'La meta description est absente.',
        optimal: 'Meta description optimale ({len} caractères).',
        short: 'Meta description courte ({len} caractères) ; l\'idéal est 120-160.',
        long: 'Meta description longue ({len} caractères) ; elle sera tronquée.',
      },
      h1Single: {
        one: 'Il y a exactement un <h1>.',
        none: 'Il n\'y a aucun <h1>.',
        many: 'Il y a {count} balises <h1> ; il ne devrait y en avoir qu\'une seule.',
      },
      headingHierarchy: {
        none: 'Il n\'y a aucun titre pour structurer le contenu.',
        skipped: 'La hiérarchie des titres saute des niveaux (p. ex. de h2 à h4).',
        ok: 'La hiérarchie des titres est cohérente.',
      },
      wordCount: {
        ok: 'Le contenu a suffisamment de profondeur ({words} mots).',
        short: 'Contenu léger ({words} mots) ; développez-le pour apporter plus de valeur.',
      },
      textHtmlRatio: {
        ok: 'Bon ratio texte/HTML ({ratio}).',
        low: 'Ratio texte/HTML faible ({ratio}) ; trop de balisage par rapport au texte.',
      },
      imgAlt: {
        none: 'Il n\'y a aucune image sur la page.',
        all: 'Toutes les images ont un attribut alt.',
        partial: 'Seulement {withAlt} des {total} images ont un alt.',
      },
      openGraph: {
        complete: 'Open Graph complet (title, description, image).',
        none: 'Aucune balise Open Graph.',
        partial: 'Open Graph incomplet ({count}/3) : il manque {missing}.',
      },
      twitterCards: {
        present: 'Twitter Card déclarée.',
        missing:
          'Aucune Twitter Card ; elles améliorent la présentation lors du partage sur X/Twitter.',
      },
      internalLinks: {
        ok: '{count} liens internes détectés.',
        none:
          'Aucun lien interne ; cela freine la découverte et la distribution de l\'autorité.',
        few: 'Seulement {count} lien(s) interne(s) ; ajoutez-en plus pour relier votre contenu.',
      },
    },
    schema: {
      jsonldPresent: {
        present: '{blocks} bloc(s) JSON-LD trouvé(s).',
        none: 'Aucune donnée structurée JSON-LD.',
      },
      typesDetected: {
        na: 'Aucun JSON-LD à analyser.',
        detected: 'Types détectés : {types}.',
        noType: 'Il y a du JSON-LD mais aucun @type reconnaissable.',
      },
      orgSameas: {
        noOrg: 'Aucun schema Organization sur la page.',
        has: 'Organization inclut sameAs avec des profils liés.',
        missing:
          'Organization sans sameAs ; ajoutez les profils officiels pour renforcer l\'entité.',
      },
      authorProfile: {
        na: 'Ce n\'est pas du contenu éditorial (Article/ProfilePage) ; non applicable.',
        has: 'Le contenu éditorial déclare un auteur.',
        missing:
          'Contenu éditorial sans auteur déclaré ; ajoutez author (Person) pour l\'E-E-A-T.',
      },
      syntaxValid: {
        na: 'Aucun JSON-LD à valider.',
        valid: 'Tous les blocs JSON-LD ont une syntaxe valide.',
        invalid:
          '{invalid} des {blocks} bloc(s) JSON-LD ont des erreurs de syntaxe et seront ignorés.',
      },
    },
    geo: {
      aiSearchBots: {
        noRobots:
          'Pas de robots.txt : par défaut, tous les bots de recherche IA peuvent explorer et citer la page.',
        allBlocked:
          'Tous les bots de recherche IA sont bloqués : votre contenu ne pourra pas être cité dans l\'IA. ({summary})',
        someBlocked:
          '{blocked} des {total} bots de recherche IA bloqués. ({summary})',
        allowed: 'Tous les bots de recherche IA peuvent explorer la page. ({summary})',
      },
      aiTrainingBots: {
        info:
          'Bots d\'entraînement : {blocked} bloqués. C\'est un choix légitime qui n\'affecte pas les citations. ({summary})',
        noRobots: 'Pas de robots.txt : tous les bots d\'entraînement peuvent utiliser le contenu.',
      },
      llmsTxt: {
        missing: 'Aucun /llms.txt trouvé.',
        structured:
          'llms.txt présent avec une structure (titres/liens Markdown).',
        unstructured:
          'llms.txt présent mais sans structure Markdown reconnaissable.',
      },
      bluf: {
        none:
          'Il n\'y a pas de paragraphe d\'introduction substantiel faisant office de réponse directe.',
        ok: 'Il y a un paragraphe de réponse directe dans les ~150 premiers mots.',
        notLeading:
          'Il y a du contenu substantiel, mais la réponse directe n\'apparaît pas au début.',
      },
      dataDensity: {
        ok: 'Bonne densité de données concrètes (chiffres, pourcentages) ; contenu citable.',
        few: 'Peu de données concrètes ; ajoutez davantage de chiffres vérifiables.',
        none:
          'Quasiment aucune donnée concrète ; le contenu est difficile à citer pour l\'IA.',
      },
      promotionalTone: {
        neutral: 'Ton neutre et objectif, adapté pour être cité par l\'IA.',
        promo:
          'Langage promotionnel détecté ({hits}) qui réduit la crédibilité auprès de l\'IA.',
      },
      qaFormat: {
        ok: 'Le contenu utilise des questions comme titres (format Q&A).',
        few:
          'Peu ou pas de questions comme titres ; le format Q&A facilite l\'extraction par l\'IA.',
      },
      tables: {
        ok: 'Il y a {count} tableau(x) de données, faciles à extraire pour l\'IA.',
        none:
          'Aucun tableau ; pour des données comparables, un tableau est plus citable que du texte.',
      },
      transcript: {
        na: 'Aucune vidéo ni embed nécessitant une transcription.',
        ok: 'Une transcription/des sous-titres sont détectés à côté du contenu audiovisuel.',
        missing:
          'Il y a une vidéo/un embed sans transcription textuelle ; ce contenu est invisible pour l\'IA.',
      },
      semanticHtml: {
        divSoup: 'Structure de type "div-soup" ({divs} divs, 0 élément sémantique).',
        good: 'Bon HTML sémantique ({count} éléments sémantiques).',
        some:
          'Un peu de HTML sémantique ({count} éléments), mais les divs dominent ({divs}).',
      },
      jsDependency: {
        fail:
          'Le HTML initial n\'a presque pas de texte ({words} mots) et dépend de JavaScript : invisible pour de nombreux crawlers d\'IA.',
        warn:
          'Dépendance possible à JavaScript ({words} mots dans le HTML, {scripts} scripts).',
        pass:
          'Le contenu principal est dans le HTML initial ({words} mots), lisible sans exécuter JavaScript.',
      },
    },
    perf: {
      coreWebVitals:
        'La mesure des Core Web Vitals (LCP, INP, CLS) nécessite un backend. Disponible dans la version Pro.',
    },
  },

  val: {
    metaRobotsDefault: 'index,follow (par défaut)',
    headings: '{n} titres',
    botsAllowed: '{allowed}/{total} autorisés',
    figures: '{n} chiffres',
    figuresPct: '{n} chiffres, {pct} %',
    expressions: '{n} expressions',
    questions: '{n} questions',
    media: '{n} médias',
    words: '{n} mots',
  },

  evidence: {
    https: { protocol: 'Protocole' },
    httpStatus: { code: 'Code de statut' },
    htmlLang: { value: 'Langue déclarée' },
    viewport: { content: 'Contenu du viewport' },
    canonical: { url: 'URL canonique' },
    metaRobots: { content: 'Meta robots' },
    robots: { url: 'URL de robots.txt' },
    sitemap: { url: 'URL de sitemap.xml' },
    urlClean: { url: "Chemin de l'URL" },
    title: { text: 'Texte du title', length: 'Longueur (caractères)' },
    metaDescription: { text: 'Texte de la description', length: 'Longueur (caractères)' },
    h1: { count: 'Nombre de H1', text: 'Premier H1' },
    headings: { count: 'Titres', outline: 'Structure' },
    wordCount: { value: 'Mots' },
    textHtmlRatio: { value: 'Ratio texte/HTML' },
    imgAlt: { coverage: 'Images avec alt', missingCount: 'Images sans alt', samples: 'Exemples' },
    openGraph: { present: 'Balises présentes', missing: 'Balises manquantes' },
    twitterCards: { card: 'Type de card' },
    internalLinks: { count: 'Liens internes', samples: 'Exemples' },
    jsonld: { blocks: 'Blocs JSON-LD' },
    schemaTypes: { list: 'Types détectés' },
    orgSameas: { profiles: 'Profils liés' },
    authorProfile: { name: 'Auteur' },
    syntaxValid: { invalid: 'Blocs avec erreurs' },
    bots: { blocked: 'Bloqués', allowed: 'Autorisés', trainingBlocked: "Bots d'entraînement bloqués" },
    llms: { url: 'URL de llms.txt', firstHeading: 'Premier titre' },
    bluf: { opening: 'Introduction' },
    dataDensity: { figures: 'Chiffres', percents: 'Pourcentages' },
    promo: { hits: 'Expressions promotionnelles' },
    qa: { count: 'Titres sous forme de question', samples: 'Exemples' },
    tables: { count: 'Tableaux' },
    transcript: { mediaCount: 'Éléments multimédias' },
    semantic: { semanticCount: 'Éléments sémantiques', divCount: 'Divs' },
    js: { words: 'Mots dans le HTML', scripts: 'Scripts externes' },
  },

  check: {
    'tech.https': {
      label: 'HTTPS',
      why: 'HTTPS chiffre la connexion et constitue un facteur de confiance et de classement. Les navigateurs signalent les pages HTTP comme "non sécurisées".',
      howToFix:
        "Installez un certificat TLS (Let's Encrypt est gratuit) et forcez une redirection 301 de HTTP vers HTTPS sur tout le site.",
    },
    'tech.http-status': {
      label: 'Code HTTP 200',
      why: 'Un 4xx/5xx empêche l\'indexation et ruine l\'expérience. La page doit répondre 200 OK.',
      howToFix:
        'Vérifiez le serveur ou le CDN : corrigez la ressource (404), les permissions (403) ou l\'erreur applicative (5xx) jusqu\'à obtenir 200.',
    },
    'tech.html-lang': {
      label: '<html lang>',
      why: 'L\'attribut lang aide les moteurs de recherche, les lecteurs d\'écran et les moteurs d\'IA à comprendre la langue du contenu.',
      howToFix: 'Ajoutez la langue à la balise racine, p. ex. <html lang="fr">.',
    },
    'tech.viewport': {
      label: 'Meta viewport',
      why: 'La balise meta viewport est requise pour un rendu responsive sur mobile ; sans elle, la page s\'affiche dézoomée.',
      howToFix:
        'Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1"> dans le <head>.',
    },
    'tech.canonical': {
      label: 'URL canonique',
      why: 'La balise canonical consolide les URLs dupliquées ou paramétrées en une seule, concentrant les signaux de classement.',
      howToFix:
        'Ajoutez <link rel="canonical" href="https://…"> avec l\'URL absolue préférée dans le <head>.',
    },
    'tech.meta-robots': {
      label: 'Meta robots',
      why: 'Un noindex/nofollow dans le meta robots retire la page des résultats de recherche et stoppe le suivi des liens.',
      howToFix:
        'Retirez noindex/nofollow de la balise meta robots si vous voulez indexer la page, ou ne le laissez que sur les pages privées.',
    },
    'tech.robots-txt': {
      label: 'robots.txt',
      why: 'robots.txt guide les crawlers sur ce à quoi ils peuvent accéder. Un fichier absent ou cassé peut causer des problèmes d\'exploration.',
      howToFix:
        'Publiez un /robots.txt valide avec des règles User-agent et Allow/Disallow, et référencez votre sitemap.',
    },
    'tech.sitemap': {
      label: 'sitemap.xml',
      why: 'Le sitemap liste vos URLs pour que les moteurs les découvrent et les indexent plus vite, surtout sur les grands sites.',
      howToFix:
        'Générez un /sitemap.xml valide, tenez-le à jour et référencez-le dans robots.txt avec "Sitemap:".',
    },
    'tech.url-clean': {
      label: 'URL propre',
      why: 'Des URLs courtes et lisibles, sans paramètres de tracking ni profondeur excessive, sont plus conviviales pour les utilisateurs et les moteurs.',
      howToFix:
        'Utilisez des slugs descriptifs en minuscules, évitez les paramètres de tracking dans les URLs indexables et gardez une faible profondeur.',
    },
    'onpage.title': {
      label: 'Balise title',
      why: 'Le <title> est le principal signal dans les résultats et les réponses d\'IA. Sa longueur et son unicité influent sur le CTR et le classement.',
      howToFix:
        'Rédigez un title unique et descriptif de 50-60 caractères avec le mot-clé principal près du début.',
    },
    'onpage.meta-description': {
      label: 'Meta description',
      why: 'La meta description est le snippet dans les résultats. Elle ne classe pas directement mais influence fortement le CTR.',
      howToFix:
        'Rédigez une description convaincante de 120-160 caractères qui résume la page et invite au clic.',
    },
    'onpage.h1-single': {
      label: 'H1 unique',
      why: 'Le H1 est le titre principal du contenu. En avoir exactement un garde la hiérarchie claire pour les utilisateurs et les crawlers.',
      howToFix:
        'Laissez un seul <h1> décrivant la page et utilisez <h2>-<h6> pour le reste de la structure.',
    },
    'onpage.heading-hierarchy': {
      label: 'Hiérarchie des titres',
      why: 'Une hiérarchie sans saut de niveau (h1→h2→h3) aide à l\'accessibilité et à la compréhension du contenu par l\'IA.',
      howToFix:
        'Ne sautez pas de niveaux : après un h2, utilisez h3, pas h4. Structurez les titres par leur sens, non par leur taille.',
    },
    'onpage.word-count': {
      label: 'Profondeur du contenu',
      why: 'Un contenu suffisant permet de couvrir le sujet et donne aux moteurs et à l\'IA de la matière pour le comprendre et le citer.',
      howToFix:
        'Développez le contenu pour couvrir le sujet à fond (300+ mots à titre indicatif) sans remplissage.',
    },
    'onpage.text-html-ratio': {
      label: 'Ratio texte/HTML',
      why: 'Un ratio très faible de texte visible par rapport au balisage peut signaler un contenu pauvre ou un excès de code lourd.',
      howToFix:
        'Réduisez le balisage et le code inline inutiles, et privilégiez le vrai contenu visible.',
    },
    'onpage.img-alt': {
      label: 'Images avec alt',
      why: 'Le texte alt décrit les images pour les lecteurs d\'écran et les moteurs, et aide à la recherche d\'images.',
      howToFix:
        'Ajoutez un alt descriptif à chaque image porteuse de sens ; utilisez alt="" vide uniquement pour les images décoratives.',
    },
    'onpage.open-graph': {
      label: 'Open Graph',
      why: 'Les balises Open Graph contrôlent l\'apparence du lien lors du partage sur les réseaux sociaux (titre, description, image).',
      howToFix:
        'Ajoutez og:title, og:description et og:image avec une image d\'au moins 1200×630 px.',
    },
    'onpage.twitter-cards': {
      label: 'Twitter Cards',
      why: 'Les Twitter Cards définissent l\'aperçu enrichi lors du partage sur X/Twitter, améliorant la visibilité.',
      howToFix:
        'Ajoutez twitter:card (p. ex. summary_large_image) ; il s\'appuie sur Open Graph pour le reste.',
    },
    'onpage.internal-links': {
      label: 'Liens internes',
      why: 'Les liens internes distribuent l\'autorité et aident les utilisateurs et les crawlers à découvrir du contenu connexe.',
      howToFix:
        'Ajoutez des liens contextuels vers d\'autres pages pertinentes avec un texte d\'ancrage descriptif.',
    },
    'schema.jsonld-present': {
      label: 'JSON-LD présent',
      why: 'Les données structurées JSON-LD permettent aux moteurs et à l\'IA de comprendre les entités et activent les résultats enrichis.',
      howToFix:
        'Ajoutez un bloc <script type="application/ld+json"> avec le type schema.org adapté à la page.',
    },
    'schema.types-detected': {
      label: 'Types de schema',
      why: 'Le @type déclaré (Article, Product, FAQPage…) indique aux moteurs de quel type de contenu il s\'agit.',
      howToFix:
        'Utilisez le type schema.org qui correspond à la page et complétez ses propriétés obligatoires.',
    },
    'schema.org-sameas': {
      label: 'Organization + sameAs',
      why: 'sameAs relie votre Organization à ses profils officiels, renforçant l\'entité auprès des moteurs et de l\'IA.',
      howToFix:
        'Ajoutez sameAs avec les URLs de vos profils sociaux et de référence officiels dans le schema Organization.',
    },
    'schema.author-profile': {
      label: 'Auteur (E-E-A-T)',
      why: 'Déclarer l\'auteur sur un contenu éditorial renforce l\'expérience et l\'autorité (E-E-A-T).',
      howToFix:
        'Ajoutez author (Person) avec un nom et, idéalement, un sameAs vers le profil de l\'auteur.',
    },
    'schema.syntax-valid': {
      label: 'Syntaxe JSON-LD valide',
      why: 'Un bloc JSON-LD comportant des erreurs de syntaxe est entièrement ignoré, gâchant son potentiel.',
      howToFix:
        'Validez le JSON-LD avec un linter ou le Test des résultats enrichis et corrigez les erreurs de parsing.',
    },
    'geo.ai-search-bots': {
      label: 'Bots de recherche IA',
      why: 'Les bots de recherche IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) alimentent la récupération en direct et les citations. Les bloquer signifie que votre site ne pourra pas être cité dans les réponses d\'IA.',
      howToFix:
        'Dans robots.txt, ne bloquez pas les user-agents de recherche IA par lesquels vous voulez être cité ; autorisez au moins la racine.',
    },
    'geo.ai-training-bots': {
      label: 'Bots d\'entraînement IA',
      why: 'Les bots d\'entraînement (GPTBot, ClaudeBot, Google-Extended…) utilisent le contenu pour entraîner les modèles. Les bloquer est légitime et n\'affecte pas les citations.',
      howToFix:
        'Décidez de façon délibérée : bloquez-les si vous ne voulez pas alimenter l\'entraînement, mais sachez que cela n\'améliore ni n\'aggrave les citations.',
    },
    'geo.llms-txt': {
      label: 'llms.txt',
      why: 'llms.txt est une convention émergente pour guider les modèles d\'IA vers votre contenu clé en Markdown.',
      howToFix:
        'Publiez un /llms.txt avec des titres et des liens Markdown vers vos pages les plus importantes.',
    },
    'geo.bluf': {
      label: 'Réponse directe (BLUF)',
      why: 'Une réponse directe en tête (Bottom Line Up Front) facilite l\'extraction et la citation de votre contenu par l\'IA.',
      howToFix:
        'Ouvrez par un paragraphe substantiel qui répond directement à l\'intention de la page dans les ~150 premiers mots.',
    },
    'geo.data-density': {
      label: 'Densité de données',
      why: 'Les données concrètes (chiffres, pourcentages, dates) rendent le contenu plus citable et vérifiable pour l\'IA.',
      howToFix:
        'Ajoutez des chiffres vérifiables, des statistiques et des données concrètes pour étayer vos affirmations.',
    },
    'geo.promotional-tone': {
      label: 'Ton objectif',
      why: 'Un langage excessivement promotionnel ("le meilleur", "imbattable") réduit la crédibilité auprès des moteurs d\'IA.',
      howToFix:
        'Remplacez les affirmations marketing par des faits vérifiables et un ton neutre et objectif.',
    },
    'geo.qa-format': {
      label: 'Format Q&A',
      why: 'Les questions en titres correspondent à la façon dont les gens interrogent l\'IA et facilitent l\'extraction des réponses.',
      howToFix:
        'Transformez les sections clés en questions (h2/h3) suivies d\'une réponse directe.',
    },
    'geo.tables': {
      label: 'Tableaux de données',
      why: 'Les tableaux structurent les données comparables pour que l\'IA les extraie et les cite de façon plus fiable que la prose.',
      howToFix:
        'Présentez les données comparatives ou numériques dans un <table> avec des en-têtes clairs plutôt qu\'en paragraphes.',
    },
    'geo.transcript': {
      label: 'Transcription vidéo',
      why: 'L\'IA ne peut pas regarder une vidéo ; sans transcription textuelle, ce contenu est invisible pour les moteurs d\'IA.',
      howToFix:
        'Ajoutez une transcription textuelle ou des sous-titres <track> à côté de chaque vidéo ou embed.',
    },
    'geo.semantic-html': {
      label: 'HTML sémantique',
      why: 'Les éléments sémantiques (article, section, main…) aident l\'IA à comprendre la structure et le sens du contenu.',
      howToFix:
        'Remplacez les divs génériques par des balises sémantiques (article, main, section, header, footer).',
    },
    'geo.js-dependency': {
      label: 'Dépendance à JavaScript',
      why: 'Si le contenu principal n\'apparaît qu\'après l\'exécution de JavaScript, de nombreux crawlers d\'IA ne le verront pas.',
      howToFix:
        'Servez le contenu principal dans le HTML initial (SSR/SSG) pour qu\'il soit lisible sans exécuter le JS.',
    },
    'perf.core-web-vitals': {
      label: 'Core Web Vitals',
      why: 'LCP, INP et CLS mesurent le chargement, l\'interactivité et la stabilité visuelle réels — des facteurs de classement de Google.',
      howToFix:
        'Optimisez les images, réduisez le JavaScript bloquant et réservez de l\'espace pour les éléments afin d\'éviter les sauts de mise en page.',
    },
  },
};

export default fr;

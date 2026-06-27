// Spanish dictionary. Mirrors the shape of the English base dictionary.

import type { Dictionary } from './en';

const es: Dictionary = {
  nav: {
    getHelp: 'Ayuda',
    language: 'Idioma',
  },

  landing: {
    titleBefore: '¿Está tu página lista para el ',
    titleSeo: 'SEO',
    titleMid: ' y la ',
    titleAi: 'IA',
    titleAfter: '?',
    subtitle:
      'Analiza cualquier URL y descubre cómo de optimizada está para el SEO clásico y para GEO — aparecer citado en respuestas de ChatGPT, Claude y Perplexity.',
  },

  url: {
    placeholder: 'introduce-una-url.com',
    analyze: 'Analizar',
    analyzing: 'Analizando…',
    errorEmpty: 'Introduce una URL para analizar.',
    errorInvalid: 'La URL no parece válida.',
    ariaLabel: 'URL a analizar',
  },

  loading: {
    title: 'Analizando',
  },

  steps: {
    'fetch-html': 'Leyendo el HTML de la página',
    'fetch-robots': 'Analizando robots.txt',
    'fetch-sitemap': 'Comprobando sitemap.xml',
    'fetch-llms': 'Buscando llms.txt',
    'analyze-technical': 'Evaluando SEO técnico',
    'analyze-onpage': 'Evaluando contenido on-page',
    'analyze-schema': 'Evaluando datos estructurados',
    'analyze-geo': 'Evaluando GEO (motores de IA)',
    scoring: 'Calculando puntuación',
  },

  status: {
    pass: 'Correcto',
    warn: 'Mejorable',
    fail: 'Falla',
    info: 'Info',
    na: 'No aplica',
  },

  category: {
    technical: 'SEO técnico',
    onpage: 'On-page',
    schema: 'Datos estructurados',
    geo: 'GEO',
    performance: 'Rendimiento',
  },

  score: {
    critical: 'Crítico',
    improvable: 'Mejorable',
    good: 'Bueno',
    excellent: 'Excelente',
  },

  dashboard: {
    heroAria: 'Puntuación global',
    heroSub:
      'Puntuación global combinando SEO clásico y GEO (optimización para motores de IA).',
    analyzedAt: 'Analizado el {date} · vía {proxy}',
    direct: 'directo',
    reanalyze: 'Re-analizar',
    newUrl: 'Analizar otra URL',
    warningsTitle: 'Avisos:',
    filterShow: 'Mostrar:',
    filterAll: 'Todo',
    filterFail: 'Solo fallos',
    filterWarn: 'Solo mejorables',
    filterAria: 'Filtrar checks',
    categoryEmpty: 'Sin elementos para este filtro en esta categoría.',
    kpis: {
      title: 'Resumen',
      pass: 'Correctos',
      warn: 'Mejorables',
      fail: 'Fallos',
      checks: '{n} checks',
    },
    distribution: {
      title: 'Distribución de estados',
    },
    ranking: {
      title: 'Categorías por impacto',
      subtitle: 'Las mayores oportunidades primero',
      impact: 'Impacto {n}',
    },
    priority: {
      title: 'Recomendaciones prioritarias',
      subtitle: 'Ordenadas por peso × severidad',
      empty: 'No hay checks con fallo ni mejorables — ¡buen trabajo!',
      inCategory: '{category}',
    },
  },

  tour: {
    toggle: 'Ayuda guiada',
    close: 'Cerrar',
    title: 'Ayuda guiada',
    hint: 'Toca cualquier check para saber qué es, cómo debe funcionar y por qué importa.',
  },

  report: {
    title: 'Análisis SEO + GEO',
    intro:
      'Esto es una auditoría automática de SEO + GEO (optimización para motores generativos). El GEO mide cómo de bien puede la página ser descubierta y citada por motores de respuesta de IA como ChatGPT, Claude y Perplexity. A partir de los hallazgos siguientes, dame un plan de acción concreto y priorizado para mejorar el SEO y el GEO de esta página.',
    url: 'URL',
    analyzed: 'Analizado',
    overall: 'Puntuación global',
    scores: 'Puntuaciones por categoría',
    findings: 'Hallazgos',
    priority: 'Recomendaciones prioritarias (por impacto)',
    finding: 'Hallazgo',
    fix: 'Cómo arreglarlo',
    performanceNote: 'no medido (requiere backend)',
    copy: 'Copiar informe para IA',
    download: 'Descargar',
    copied: '¡Copiado!',
  },

  categoryCard: {
    lockedAria: '{label} (bloqueado)',
    lockedBody:
      'La medición de Core Web Vitals (LCP, INP, CLS) requiere un backend con datos de campo y no puede ejecutarse de forma segura en el navegador.',
    proCta: 'Disponible en la versión Pro',
    scoreAria: 'Sub-score de {label}',
  },

  detail: {
    what: 'Qué es',
    found: 'Qué encontramos',
    why: 'Por qué importa',
    howToFix: 'Cómo arreglarlo',
    moreInfo: 'Más información ↗',
  },

  errors: {
    unknown: 'Error desconocido al analizar.',
    fetchFailed:
      'No se pudo obtener la página. Comprueba la URL o inténtalo de nuevo. ({detail})',
    noDetails: 'sin detalles',
  },

  warnings: {
    robots: 'No se pudo obtener robots.txt.',
    sitemap: 'No se pudo obtener sitemap.xml.',
  },

  msg: {
    tech: {
      https: {
        pass: 'La página se sirve sobre HTTPS.',
        fail: 'La página no usa HTTPS; la conexión no está cifrada.',
      },
      httpStatus: {
        proxy:
          'El código HTTP no es observable a través del proxy; se obtuvo contenido, así que la página responde.',
        ok: 'La página responde {status} OK.',
        other: 'La página responde {status}.',
      },
      htmlLang: {
        pass: 'Idioma declarado: "{lang}".',
        fail: 'Falta el atributo lang en la etiqueta <html>.',
      },
      viewport: {
        pass: 'Meta viewport presente; la página es responsive-ready.',
        fail: 'Falta el meta viewport; la página no se adaptará a móvil.',
      },
      canonical: {
        missing: 'No se encontró etiqueta canonical.',
        ok: 'Canonical presente y bien formado.',
        notAbsolute: 'Canonical presente pero no es una URL absoluta válida.',
      },
      metaRobots: {
        blocks: 'El meta robots bloquea la indexación/seguimiento ("{value}").',
        ok: 'El meta robots no bloquea la indexación.',
      },
      robotsTxt: {
        missing: 'No se pudo obtener /robots.txt o no existe.',
        valid: 'robots.txt existe y contiene directivas válidas.',
        invalid:
          'robots.txt existe pero no contiene directivas User-agent reconocibles.',
      },
      sitemap: {
        missingRef:
          'robots.txt referencia un sitemap, pero /sitemap.xml no respondió.',
        missing: 'No se encontró /sitemap.xml ni referencia en robots.txt.',
        invalid: 'sitemap.xml responde pero no parece un XML de sitemap válido.',
        validRef: 'sitemap.xml válido y referenciado desde robots.txt.',
        validNoRef: 'sitemap.xml válido, pero no está referenciado en robots.txt.',
      },
      urlClean: {
        dirty: 'URL mejorable{reasons}.',
        clean: 'URL limpia y legible.',
        tracking: ' (parámetros de tracking)',
        depth: ' (profundidad alta)',
        upper: ' (mayúsculas)',
      },
    },
    onpage: {
      title: {
        missing: 'No hay etiqueta <title>.',
        generic: 'El title es genérico ("{title}").',
        optimal: 'Title óptimo ({len} caracteres).',
        acceptable:
          'Title aceptable pero fuera del rango ideal de 50-60 ({len} caracteres).',
        short: 'Title demasiado corto ({len} caracteres).',
        long: 'Title demasiado largo ({len} caracteres); se truncará en los resultados.',
      },
      metaDescription: {
        missing: 'Falta la meta description.',
        optimal: 'Meta description óptima ({len} caracteres).',
        short: 'Meta description corta ({len} caracteres); ideal 120-160.',
        long: 'Meta description larga ({len} caracteres); se truncará.',
      },
      h1Single: {
        one: 'Hay exactamente un <h1>.',
        none: 'No hay ningún <h1>.',
        many: 'Hay {count} etiquetas <h1>; debería haber solo una.',
      },
      headingHierarchy: {
        none: 'No hay encabezados que estructuren el contenido.',
        skipped: 'La jerarquía de encabezados salta niveles (p. ej. de h2 a h4).',
        ok: 'La jerarquía de encabezados es coherente.',
      },
      wordCount: {
        ok: 'Contenido con suficiente profundidad ({words} palabras).',
        short: 'Contenido breve ({words} palabras); amplíalo para aportar más valor.',
      },
      textHtmlRatio: {
        ok: 'Buen ratio texto/HTML ({ratio}).',
        low: 'Ratio texto/HTML bajo ({ratio}); demasiado marcado frente al texto.',
      },
      imgAlt: {
        none: 'No hay imágenes en la página.',
        all: 'Todas las imágenes tienen atributo alt.',
        partial: 'Solo {withAlt} de {total} imágenes tienen alt.',
      },
      openGraph: {
        complete: 'Open Graph completo (title, description, image).',
        none: 'No hay etiquetas Open Graph.',
        partial: 'Open Graph incompleto ({count}/3): falta {missing}.',
      },
      twitterCards: {
        present: 'Twitter Card declarada.',
        missing:
          'No hay Twitter Cards; mejoran la presentación al compartir en X/Twitter.',
      },
      internalLinks: {
        ok: '{count} enlaces internos detectados.',
        none:
          'No hay enlaces internos; dificulta el descubrimiento y la distribución de autoridad.',
        few: 'Solo {count} enlace(s) interno(s); añade más para enlazar tu contenido.',
      },
    },
    schema: {
      jsonldPresent: {
        present: 'Se encontraron {blocks} bloque(s) JSON-LD.',
        none: 'No hay datos estructurados JSON-LD.',
      },
      typesDetected: {
        na: 'Sin JSON-LD que analizar.',
        detected: 'Tipos detectados: {types}.',
        noType: 'Hay JSON-LD pero sin @type reconocible.',
      },
      orgSameas: {
        noOrg: 'No hay schema Organization en la página.',
        has: 'Organization incluye sameAs con perfiles vinculados.',
        missing:
          'Organization sin sameAs; añade los perfiles oficiales para reforzar la entidad.',
      },
      authorProfile: {
        na: 'No es contenido editorial (Article/ProfilePage); no aplica.',
        has: 'El contenido editorial declara autor.',
        missing:
          'Contenido editorial sin autor declarado; añade author (Person) para E-E-A-T.',
      },
      syntaxValid: {
        na: 'Sin JSON-LD que validar.',
        valid: 'Todos los bloques JSON-LD tienen sintaxis válida.',
        invalid:
          '{invalid} de {blocks} bloque(s) JSON-LD tienen errores de sintaxis y serán ignorados.',
      },
    },
    geo: {
      aiSearchBots: {
        noRobots:
          'Sin robots.txt: por defecto todos los bots de búsqueda de IA pueden rastrear y citar la página.',
        allBlocked:
          'Todos los bots de búsqueda de IA están bloqueados: tu contenido no podrá citarse en IA. ({summary})',
        someBlocked:
          '{blocked} de {total} bots de búsqueda de IA bloqueados. ({summary})',
        allowed: 'Todos los bots de búsqueda de IA pueden rastrear la página. ({summary})',
      },
      aiTrainingBots: {
        info:
          'Bots de entrenamiento: {blocked} bloqueados. Es una decisión legítima y no afecta a las citas. ({summary})',
        noRobots: 'Sin robots.txt: todos los bots de entrenamiento pueden usar el contenido.',
      },
      llmsTxt: {
        missing: 'No se encontró /llms.txt.',
        structured:
          'llms.txt presente con estructura (encabezados/enlaces Markdown).',
        unstructured:
          'llms.txt presente pero sin una estructura Markdown reconocible.',
      },
      bluf: {
        none:
          'No hay un párrafo sustancial al inicio que actúe como respuesta directa.',
        ok: 'Hay un párrafo con respuesta directa dentro de las primeras ~150 palabras.',
        notLeading:
          'Hay contenido sustancial, pero la respuesta directa no aparece al principio.',
      },
      dataDensity: {
        ok: 'Buena densidad de datos concretos (cifras, porcentajes); contenido citable.',
        few: 'Pocos datos concretos; añade más cifras verificables.',
        none:
          'Apenas hay datos concretos; el contenido es difícil de citar por la IA.',
      },
      promotionalTone: {
        neutral: 'Tono neutral y objetivo, adecuado para ser citado por la IA.',
        promo:
          'Se detectó lenguaje promocional ({hits}) que reduce la credibilidad ante la IA.',
      },
      qaFormat: {
        ok: 'El contenido usa preguntas como encabezados (formato Q&A).',
        few:
          'Pocas o ninguna pregunta como encabezado; el formato Q&A favorece la extracción por IA.',
      },
      tables: {
        ok: 'Hay {count} tabla(s) de datos, fáciles de extraer por la IA.',
        none:
          'No hay tablas; para datos comparables, una tabla es más citable que el texto.',
      },
      transcript: {
        na: 'No hay vídeos ni embeds que requieran transcripción.',
        ok: 'Se detecta transcripción/subtítulos junto al contenido audiovisual.',
        missing:
          'Hay vídeo/embed sin transcripción textual; ese contenido es invisible para la IA.',
      },
      semanticHtml: {
        divSoup: 'Estructura tipo "div-soup" ({divs} divs, 0 elementos semánticos).',
        good: 'Buen HTML semántico ({count} elementos semánticos).',
        some:
          'Algo de HTML semántico ({count} elementos), pero predominan los divs ({divs}).',
      },
      jsDependency: {
        fail:
          'El HTML inicial casi no tiene texto ({words} palabras) y depende de JavaScript: invisible para muchos rastreadores de IA.',
        warn:
          'Posible dependencia de JavaScript ({words} palabras en HTML, {scripts} scripts).',
        pass:
          'El contenido principal está en el HTML inicial ({words} palabras), legible sin ejecutar JavaScript.',
      },
    },
    perf: {
      coreWebVitals:
        'La medición de Core Web Vitals (LCP, INP, CLS) requiere backend. Disponible en la versión Pro.',
    },
  },

  val: {
    metaRobotsDefault: 'index,follow (por defecto)',
    headings: '{n} encabezados',
    botsAllowed: '{allowed}/{total} permitidos',
    figures: '{n} cifras',
    figuresPct: '{n} cifras, {pct} %',
    expressions: '{n} expresiones',
    questions: '{n} preguntas',
    media: '{n} medios',
    words: '{n} palabras',
  },

  evidence: {
    https: { protocol: 'Protocolo' },
    httpStatus: { code: 'Código de estado' },
    htmlLang: { value: 'Idioma declarado' },
    viewport: { content: 'Contenido del viewport' },
    canonical: { url: 'URL canonical' },
    metaRobots: { content: 'Meta robots' },
    robots: { url: 'URL de robots.txt' },
    sitemap: { url: 'URL de sitemap.xml' },
    urlClean: { url: 'Ruta de la URL' },
    title: { text: 'Texto del title', length: 'Longitud (caracteres)' },
    metaDescription: { text: 'Texto de la descripción', length: 'Longitud (caracteres)' },
    h1: { count: 'Nº de H1', text: 'Primer H1' },
    headings: { count: 'Encabezados', outline: 'Esquema' },
    wordCount: { value: 'Palabras' },
    textHtmlRatio: { value: 'Ratio texto/HTML' },
    imgAlt: { coverage: 'Imágenes con alt', missingCount: 'Imágenes sin alt', samples: 'Ejemplos' },
    openGraph: { present: 'Etiquetas presentes', missing: 'Etiquetas que faltan' },
    twitterCards: { card: 'Tipo de card' },
    internalLinks: { count: 'Enlaces internos', samples: 'Ejemplos' },
    jsonld: { blocks: 'Bloques JSON-LD' },
    schemaTypes: { list: 'Tipos detectados' },
    orgSameas: { profiles: 'Perfiles vinculados' },
    authorProfile: { name: 'Autor' },
    syntaxValid: { invalid: 'Bloques con errores' },
    bots: { blocked: 'Bloqueados', allowed: 'Permitidos', trainingBlocked: 'Bots de entrenamiento bloqueados' },
    llms: { url: 'URL de llms.txt', firstHeading: 'Primer encabezado' },
    bluf: { opening: 'Apertura' },
    dataDensity: { figures: 'Cifras', percents: 'Porcentajes' },
    promo: { hits: 'Frases promocionales' },
    qa: { count: 'Preguntas como encabezado', samples: 'Ejemplos' },
    tables: { count: 'Tablas' },
    transcript: { mediaCount: 'Elementos multimedia' },
    semantic: { semanticCount: 'Elementos semánticos', divCount: 'Divs' },
    js: { words: 'Palabras en HTML', scripts: 'Scripts externos' },
  },

  check: {
    'tech.https': {
      label: 'HTTPS',
      why: 'HTTPS cifra la conexión y es un factor de confianza y de ranking. Los navegadores marcan como "no seguras" las páginas HTTP.',
      howToFix:
        "Instala un certificado TLS (Let's Encrypt es gratuito) y fuerza la redirección 301 de HTTP a HTTPS en todo el sitio.",
    },
    'tech.http-status': {
      label: 'Código HTTP 200',
      why: 'Un 4xx/5xx impide la indexación y arruina la experiencia. La página debe responder 200 OK.',
      howToFix:
        'Revisa el servidor o el CDN: corrige el recurso (404), los permisos (403) o el error de aplicación (5xx) hasta devolver 200.',
    },
    'tech.html-lang': {
      label: '<html lang>',
      why: 'El atributo lang ayuda a buscadores, lectores de pantalla y motores de IA a entender el idioma del contenido.',
      howToFix: 'Añade el idioma a la etiqueta raíz, p. ej. <html lang="es">.',
    },
    'tech.viewport': {
      label: 'Meta viewport',
      why: 'El meta viewport es necesario para el renderizado responsive en móvil; sin él la página se ve alejada.',
      howToFix:
        'Añade <meta name="viewport" content="width=device-width, initial-scale=1"> al <head>.',
    },
    'tech.canonical': {
      label: 'URL canónica',
      why: 'La etiqueta canonical consolida URLs duplicadas o con parámetros en una sola, concentrando las señales de ranking.',
      howToFix:
        'Añade <link rel="canonical" href="https://…"> con la URL absoluta preferida en el <head>.',
    },
    'tech.meta-robots': {
      label: 'Meta robots',
      why: 'Un noindex/nofollow en meta robots saca la página de los resultados y detiene el seguimiento de enlaces.',
      howToFix:
        'Elimina noindex/nofollow de la etiqueta meta robots si quieres indexar la página, o déjalo solo en páginas privadas.',
    },
    'tech.robots-txt': {
      label: 'robots.txt',
      why: 'robots.txt guía a los rastreadores sobre qué pueden acceder. Uno ausente o roto puede causar problemas de rastreo.',
      howToFix:
        'Publica un /robots.txt válido con reglas User-agent y Allow/Disallow, y referencia tu sitemap.',
    },
    'tech.sitemap': {
      label: 'sitemap.xml',
      why: 'El sitemap lista tus URLs para que los motores las descubran e indexen más rápido, sobre todo en sitios grandes.',
      howToFix:
        'Genera un /sitemap.xml válido, mantenlo actualizado y referéncialo en robots.txt con "Sitemap:".',
    },
    'tech.url-clean': {
      label: 'URL limpia',
      why: 'Las URLs cortas, legibles y sin parámetros de tracking ni profundidad excesiva son más amigables para usuarios y motores.',
      howToFix:
        'Usa slugs descriptivos en minúscula, evita parámetros de tracking en URLs indexables y mantén la profundidad baja.',
    },
    'onpage.title': {
      label: 'Etiqueta title',
      why: 'El <title> es la principal señal en resultados y respuestas de IA. Su longitud y unicidad afectan al CTR y al ranking.',
      howToFix:
        'Escribe un title único y descriptivo de 50-60 caracteres con la palabra clave principal al inicio.',
    },
    'onpage.meta-description': {
      label: 'Meta description',
      why: 'La meta description es el snippet en resultados. No posiciona directamente pero influye mucho en el CTR.',
      howToFix:
        'Escribe una descripción atractiva de 120-160 caracteres que resuma la página e invite al clic.',
    },
    'onpage.h1-single': {
      label: 'H1 único',
      why: 'El H1 es el encabezado principal del contenido. Exactamente uno mantiene clara la jerarquía para usuarios y rastreadores.',
      howToFix:
        'Deja un único <h1> que describa la página y usa <h2>-<h6> para el resto de la estructura.',
    },
    'onpage.heading-hierarchy': {
      label: 'Jerarquía de encabezados',
      why: 'Una jerarquía sin saltos de nivel (h1→h2→h3) ayuda a la accesibilidad y a la comprensión del contenido por la IA.',
      howToFix:
        'No saltes niveles: tras un h2 usa h3, no h4. Estructura los encabezados por su significado, no por su tamaño.',
    },
    'onpage.word-count': {
      label: 'Profundidad de contenido',
      why: 'Suficiente contenido permite cubrir el tema y da a motores e IA material para entenderlo y citarlo.',
      howToFix:
        'Amplía el contenido para cubrir el tema a fondo (300+ palabras como orientación) sin relleno.',
    },
    'onpage.text-html-ratio': {
      label: 'Ratio texto/HTML',
      why: 'Un ratio muy bajo de texto visible frente al marcado puede señalar contenido pobre o exceso de código pesado.',
      howToFix:
        'Reduce el marcado y el código inline innecesario, y prioriza el contenido visible real.',
    },
    'onpage.img-alt': {
      label: 'Imágenes con alt',
      why: 'El texto alt describe las imágenes para lectores de pantalla y motores, y ayuda a la búsqueda de imágenes.',
      howToFix:
        'Añade un alt descriptivo a cada imagen con significado; usa alt="" vacío solo para las decorativas.',
    },
    'onpage.open-graph': {
      label: 'Open Graph',
      why: 'Las etiquetas Open Graph controlan cómo se ve el enlace al compartirlo en redes (título, descripción, imagen).',
      howToFix:
        'Añade og:title, og:description y og:image con una imagen de al menos 1200×630 px.',
    },
    'onpage.twitter-cards': {
      label: 'Twitter Cards',
      why: 'Las Twitter Cards definen la vista previa enriquecida al compartir en X/Twitter, mejorando la visibilidad.',
      howToFix:
        'Añade twitter:card (p. ej. summary_large_image); reutiliza Open Graph para el resto.',
    },
    'onpage.internal-links': {
      label: 'Enlaces internos',
      why: 'Los enlaces internos distribuyen autoridad y ayudan a usuarios y rastreadores a descubrir contenido relacionado.',
      howToFix:
        'Añade enlaces contextuales a otras páginas relevantes con un texto ancla descriptivo.',
    },
    'schema.jsonld-present': {
      label: 'JSON-LD presente',
      why: 'Los datos estructurados JSON-LD permiten a motores e IA entender entidades y habilitan resultados enriquecidos.',
      howToFix:
        'Añade un bloque <script type="application/ld+json"> con el tipo de schema.org que encaje con la página.',
    },
    'schema.types-detected': {
      label: 'Tipos de schema',
      why: 'El @type declarado (Article, Product, FAQPage…) indica a los motores qué clase de contenido es.',
      howToFix:
        'Usa el tipo de schema.org que corresponda a la página y completa sus propiedades obligatorias.',
    },
    'schema.org-sameas': {
      label: 'Organization + sameAs',
      why: 'sameAs vincula tu Organization con sus perfiles oficiales, reforzando la entidad ante motores e IA.',
      howToFix:
        'Añade sameAs con las URLs de tus perfiles sociales y de referencia oficiales en el schema Organization.',
    },
    'schema.author-profile': {
      label: 'Autor (E-E-A-T)',
      why: 'Declarar el autor en contenido editorial refuerza la experiencia y autoridad (E-E-A-T).',
      howToFix:
        'Añade author (Person) con nombre e, idealmente, un sameAs al perfil del autor.',
    },
    'schema.syntax-valid': {
      label: 'Sintaxis JSON-LD válida',
      why: 'Un bloque JSON-LD con errores de sintaxis se ignora por completo, desperdiciando su potencial.',
      howToFix:
        'Valida el JSON-LD con un linter o el Test de Resultados Enriquecidos y corrige los errores de parseo.',
    },
    'geo.ai-search-bots': {
      label: 'Bots de búsqueda de IA',
      why: 'Los bots de búsqueda de IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) alimentan la recuperación en vivo y las citas. Bloquearlos significa que tu sitio no podrá citarse en respuestas de IA.',
      howToFix:
        'En robots.txt, no bloquees los user-agents de búsqueda de IA por los que quieras ser citado; permite al menos la raíz.',
    },
    'geo.ai-training-bots': {
      label: 'Bots de entrenamiento de IA',
      why: 'Los bots de entrenamiento (GPTBot, ClaudeBot, Google-Extended…) usan el contenido para entrenar modelos. Bloquearlos es legítimo y no afecta a las citas.',
      howToFix:
        'Decide de forma deliberada: bloquéalos si no quieres alimentar el entrenamiento, pero ten claro que no mejora ni empeora las citas.',
    },
    'geo.llms-txt': {
      label: 'llms.txt',
      why: 'llms.txt es una convención emergente para guiar a los modelos de IA hacia tu contenido clave en Markdown.',
      howToFix:
        'Publica un /llms.txt con encabezados y enlaces Markdown a tus páginas más importantes.',
    },
    'geo.bluf': {
      label: 'Respuesta directa (BLUF)',
      why: 'Una respuesta directa al inicio (Bottom Line Up Front) facilita que la IA extraiga y cite tu contenido.',
      howToFix:
        'Abre con un párrafo sustancial que responda la intención de la página directamente en las primeras ~150 palabras.',
    },
    'geo.data-density': {
      label: 'Densidad de datos',
      why: 'Los datos concretos (cifras, porcentajes, fechas) hacen el contenido más citable y verificable para la IA.',
      howToFix:
        'Añade cifras verificables, estadísticas y datos concretos que respalden tus afirmaciones.',
    },
    'geo.promotional-tone': {
      label: 'Tono objetivo',
      why: 'El lenguaje excesivamente promocional ("el mejor", "inigualable") reduce la credibilidad ante los motores de IA.',
      howToFix:
        'Sustituye las afirmaciones de marketing por hechos verificables y un tono neutral y objetivo.',
    },
    'geo.qa-format': {
      label: 'Formato Q&A',
      why: 'Las preguntas como encabezados coinciden con cómo la gente pregunta a la IA y facilitan la extracción de respuestas.',
      howToFix:
        'Convierte las secciones clave en preguntas (h2/h3) seguidas de una respuesta directa.',
    },
    'geo.tables': {
      label: 'Tablas de datos',
      why: 'Las tablas estructuran datos comparables para que la IA los extraiga y cite con más fiabilidad que la prosa.',
      howToFix:
        'Presenta los datos comparativos o numéricos en <table> con cabeceras claras en vez de párrafos.',
    },
    'geo.transcript': {
      label: 'Transcripción de vídeo',
      why: 'La IA no puede ver vídeo; sin una transcripción textual ese contenido es invisible para los motores de IA.',
      howToFix:
        'Añade una transcripción textual o subtítulos <track> junto a cada vídeo o embed.',
    },
    'geo.semantic-html': {
      label: 'HTML semántico',
      why: 'Los elementos semánticos (article, section, main…) ayudan a la IA a entender la estructura y el significado del contenido.',
      howToFix:
        'Sustituye los divs genéricos por etiquetas semánticas (article, main, section, header, footer).',
    },
    'geo.js-dependency': {
      label: 'Dependencia de JavaScript',
      why: 'Si el contenido principal solo aparece tras ejecutar JavaScript, muchos rastreadores de IA no lo verán.',
      howToFix:
        'Sirve el contenido principal en el HTML inicial (SSR/SSG) para que sea legible sin ejecutar JS.',
    },
    'perf.core-web-vitals': {
      label: 'Core Web Vitals',
      why: 'LCP, INP y CLS miden la carga, interactividad y estabilidad visual reales — factores de ranking de Google.',
      howToFix:
        'Optimiza imágenes, reduce el JavaScript bloqueante y reserva espacio para los elementos para evitar saltos de layout.',
    },
  },
};

export default es;

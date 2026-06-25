// Central catalog of every check's static metadata (label, educational copy,
// weight, docs link). Analysis modules only decide status/value/message and
// merge with this catalog via `buildCheck`, keeping the long-form copy in one
// place and out of the analysis logic.

import type { CheckResult, CheckStatus } from './types';

export interface CheckMeta {
  label: string;
  why: string;
  howToFix: string;
  /** Relative weight inside the category. Higher = more impactful. */
  weight: number;
  docsRef?: string;
}

export const CHECKS: Record<string, CheckMeta> = {
  // ── Bloque A · SEO técnico ────────────────────────────────────────────────
  'tech.https': {
    label: 'HTTPS',
    why: 'HTTPS cifra la conexión y es un factor de confianza y de ranking. Los navegadores marcan como "no seguras" las páginas HTTP.',
    howToFix: 'Instala un certificado TLS (Let\'s Encrypt es gratuito) y fuerza la redirección 301 de HTTP a HTTPS en todo el sitio.',
    weight: 3,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/https',
  },
  'tech.http-status': {
    label: 'Código HTTP 200',
    why: 'Un 4xx/5xx impide la indexación y arruina la experiencia. La página debe responder 200 OK.',
    howToFix: 'Revisa el servidor o el CDN: corrige el recurso (404), los permisos (403) o el error de aplicación (5xx) hasta devolver 200.',
    weight: 3,
  },
  'tech.html-lang': {
    label: '<html lang>',
    why: 'El atributo lang ayuda a buscadores, lectores de pantalla y motores de IA a entender el idioma del contenido.',
    howToFix: 'Añade el idioma a la etiqueta raíz, p. ej. <html lang="es">.',
    weight: 1,
    docsRef: 'https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang',
  },
  'tech.viewport': {
    label: 'Meta viewport',
    why: 'Sin meta viewport la página no se adapta a móvil, lo que penaliza el ranking mobile-first.',
    howToFix: 'Añade <meta name="viewport" content="width=device-width, initial-scale=1"> en el <head>.',
    weight: 2,
  },
  'tech.canonical': {
    label: 'Canonical',
    why: 'La etiqueta canonical evita contenido duplicado indicando la URL preferida.',
    howToFix: 'Añade <link rel="canonical" href="URL-absoluta"> apuntando a la versión definitiva y absoluta de la página.',
    weight: 2,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  },
  'tech.meta-robots': {
    label: 'Meta robots',
    why: 'Un meta robots con noindex/nofollow puede excluir la página de los buscadores sin que te des cuenta.',
    howToFix: 'Asegúrate de que el meta robots no contenga noindex/nofollow salvo que sea intencional. Por defecto, index,follow.',
    weight: 2,
  },
  'tech.robots-txt': {
    label: 'robots.txt',
    why: 'robots.txt guía a los rastreadores sobre qué pueden visitar. Su ausencia o errores pueden bloquear el rastreo.',
    howToFix: 'Publica /robots.txt válido con al menos User-agent y, preferiblemente, una línea Sitemap:.',
    weight: 2,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
  },
  'tech.sitemap': {
    label: 'sitemap.xml',
    why: 'El sitemap ayuda a descubrir e indexar todas las URLs. Idealmente se referencia desde robots.txt.',
    howToFix: 'Genera /sitemap.xml válido y añádelo a robots.txt con "Sitemap: https://tu-dominio/sitemap.xml".',
    weight: 2,
    docsRef: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
  },
  'tech.url-clean': {
    label: 'URL limpia',
    why: 'URLs cortas, legibles y sin parámetros de tracking se comparten y posicionan mejor.',
    howToFix: 'Evita parámetros innecesarios (utm_*, ids de sesión), mayúsculas y profundidades excesivas. Usa guiones y palabras claras.',
    weight: 1,
  },

  // ── Bloque B · On-page ────────────────────────────────────────────────────
  'onpage.title': {
    label: '<title>',
    why: 'El title es el principal indicador de relevancia y el texto azul en los resultados. ~50-60 caracteres es lo óptimo.',
    howToFix: 'Escribe un title único y descriptivo de 50-60 caracteres con la keyword principal cerca del inicio.',
    weight: 3,
  },
  'onpage.meta-description': {
    label: 'Meta description',
    why: 'No es factor de ranking directo, pero una buena descripción mejora el CTR. ~120-160 caracteres.',
    howToFix: 'Redacta una meta description atractiva de 120-160 caracteres que resuma la página e invite al clic.',
    weight: 2,
  },
  'onpage.h1-single': {
    label: 'Un único <h1>',
    why: 'El H1 define el tema principal. Tener cero o varios diluye el mensaje para buscadores y lectores.',
    howToFix: 'Usa exactamente un <h1> que describa el tema central de la página.',
    weight: 2,
  },
  'onpage.heading-hierarchy': {
    label: 'Jerarquía de headings',
    why: 'Una jerarquía sin saltos (h1→h2→h3) estructura el contenido y facilita su comprensión por IA y buscadores.',
    howToFix: 'No saltes niveles (de h2 a h4). Anida los encabezados de forma lógica y secuencial.',
    weight: 1,
  },
  'onpage.word-count': {
    label: 'Conteo de palabras',
    why: 'El contenido demasiado breve suele aportar poco valor y rinde peor. La profundidad ayuda al posicionamiento.',
    howToFix: 'Amplía el contenido con información útil y original. Como referencia, >300 palabras para contenido informativo.',
    weight: 1,
  },
  'onpage.text-html-ratio': {
    label: 'Ratio texto/HTML',
    why: 'Un ratio muy bajo indica páginas con poco texto real frente a mucho marcado, señal de baja densidad de contenido.',
    howToFix: 'Aumenta el texto visible y reduce el HTML/inline innecesario. Un ratio >10% es una referencia razonable.',
    weight: 1,
  },
  'onpage.img-alt': {
    label: 'Imágenes con alt',
    why: 'El texto alt da accesibilidad y contexto a buscadores e IA sobre el contenido de las imágenes.',
    howToFix: 'Añade alt descriptivo a las imágenes informativas. Las decorativas pueden llevar alt="".',
    weight: 2,
  },
  'onpage.open-graph': {
    label: 'Open Graph',
    why: 'Las etiquetas og: controlan cómo se ve la página al compartirse en redes y mejoran el CTR social.',
    howToFix: 'Añade og:title, og:description y og:image (y og:url) en el <head>.',
    weight: 2,
    docsRef: 'https://ogp.me/',
  },
  'onpage.twitter-cards': {
    label: 'Twitter Cards',
    why: 'twitter:card y compañía mejoran la presentación al compartir en X/Twitter.',
    howToFix: 'Añade twitter:card (p. ej. summary_large_image), twitter:title y twitter:description.',
    weight: 1,
  },
  'onpage.internal-links': {
    label: 'Enlaces internos',
    why: 'Los enlaces internos distribuyen autoridad y ayudan a descubrir y contextualizar el contenido.',
    howToFix: 'Incluye enlaces relevantes a otras páginas de tu propio sitio con anchor text descriptivo.',
    weight: 1,
  },

  // ── Bloque C · Schema (JSON-LD) ───────────────────────────────────────────
  'schema.jsonld-present': {
    label: 'JSON-LD presente',
    why: 'Los datos estructurados ayudan a buscadores e IA a entender entidades y pueden generar resultados enriquecidos.',
    howToFix: 'Añade un bloque <script type="application/ld+json"> con el schema.org relevante a tu contenido.',
    weight: 3,
    docsRef: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
  },
  'schema.types-detected': {
    label: 'Tipos de schema',
    why: 'Tipos como Article, Product, FAQPage o BreadcrumbList desbloquean funciones específicas en buscadores e IA.',
    howToFix: 'Declara los @type adecuados a tu contenido (Article para posts, Product para fichas, FAQPage para preguntas…).',
    weight: 2,
  },
  'schema.org-sameas': {
    label: 'Organization · sameAs',
    why: 'sameAs vincula tu organización con sus perfiles (redes, Wikipedia…), reforzando la entidad para IA y buscadores.',
    howToFix: 'En el schema Organization añade un array sameAs con las URLs oficiales de tus perfiles.',
    weight: 1,
  },
  'schema.author-profile': {
    label: 'Autor / ProfilePage',
    why: 'En contenido editorial, declarar autor (Person/ProfilePage) aporta E-E-A-T y credibilidad ante la IA.',
    howToFix: 'Para artículos, añade la propiedad author (Person) y, si aplica, un ProfilePage del autor.',
    weight: 1,
  },
  'schema.syntax-valid': {
    label: 'Sintaxis JSON-LD válida',
    why: 'Un JSON-LD con errores de sintaxis se ignora por completo, perdiendo todo su valor.',
    howToFix: 'Valida que cada bloque ld+json sea JSON correcto (comillas, comas, llaves). Usa un validador de datos estructurados.',
    weight: 2,
  },

  // ── Bloque D · GEO ────────────────────────────────────────────────────────
  'geo.ai-search-bots': {
    label: 'Bots de búsqueda IA permitidos',
    why: 'Si bloqueas los bots de búsqueda/RAG (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) tu sitio NO podrá ser citado en respuestas de IA. Es lo más crítico de GEO.',
    howToFix: 'En robots.txt no bloquees los user-agents de búsqueda de IA. Permíteles rastrear el contenido que quieres que se cite.',
    weight: 4,
    docsRef: 'https://platform.openai.com/docs/bots',
  },
  'geo.ai-training-bots': {
    label: 'Bots de entrenamiento IA',
    why: 'Los bots de entrenamiento (GPTBot, ClaudeBot, Google-Extended…) usan tu contenido para entrenar modelos. Bloquearlos es una decisión legítima y NO impide las citas, pero conviene saber tu postura.',
    howToFix: 'Decide conscientemente: permítelos para máxima exposición, o bloquéalos en robots.txt si no quieres ceder contenido al entrenamiento.',
    weight: 1,
  },
  'geo.llms-txt': {
    label: 'llms.txt',
    why: 'llms.txt es una convención emergente para guiar a los modelos hacia tu contenido clave en formato limpio.',
    howToFix: 'Publica /llms.txt en Markdown con un título H1, un resumen y enlaces a tus páginas más importantes.',
    weight: 2,
    docsRef: 'https://llmstxt.org/',
  },
  'geo.bluf': {
    label: 'Answer Capsule (BLUF)',
    why: 'Los motores de IA extraen mejor una respuesta directa colocada al principio (Bottom Line Up Front), en las primeras ~150 palabras.',
    howToFix: 'Abre la página con un párrafo que responda directamente a la pregunta principal antes de contexto o introducción.',
    weight: 3,
  },
  'geo.data-density': {
    label: 'Densidad de datos',
    why: 'Cifras, estadísticas y porcentajes concretos hacen el contenido más citable: la IA prefiere afirmaciones verificables.',
    howToFix: 'Incluye datos específicos (números, %, fechas, comparativas) en lugar de afirmaciones vagas.',
    weight: 2,
  },
  'geo.promotional-tone': {
    label: 'Tono promocional',
    why: 'El lenguaje promocional ("la mejor opción", "esencial", "actúa ya") reduce la fiabilidad percibida y penaliza la cita en IA.',
    howToFix: 'Sustituye el marketing por información objetiva y neutral. Deja que los datos hablen.',
    weight: 2,
  },
  'geo.qa-format': {
    label: 'Formato Q&A',
    why: 'Las preguntas como encabezados coinciden con cómo los usuarios consultan a la IA y facilitan la extracción de respuestas.',
    howToFix: 'Estructura parte del contenido con preguntas reales como headings (h2/h3) seguidas de respuestas concisas.',
    weight: 2,
  },
  'geo.tables': {
    label: 'Tablas de datos',
    why: 'Las tablas presentan datos comparables de forma estructurada, muy fáciles de extraer y citar por la IA.',
    howToFix: 'Cuando compares opciones o listes datos, usa <table> semántica en lugar de párrafos o imágenes.',
    weight: 1,
  },
  'geo.transcript': {
    label: 'Transcripción de vídeo',
    why: 'La IA no "ve" el vídeo. Sin transcripción, ese contenido es invisible para los motores generativos.',
    howToFix: 'Añade una transcripción o resumen textual junto a cada vídeo o embed.',
    weight: 1,
  },
  'geo.semantic-html': {
    label: 'HTML semántico',
    why: 'Etiquetas como <article>, <section> y headings ayudan a la IA a segmentar el contenido. El "div-soup" lo dificulta.',
    howToFix: 'Usa elementos semánticos (article, section, header, main, nav) en vez de div genéricos para la estructura.',
    weight: 2,
  },
  'geo.js-dependency': {
    label: 'Dependencia de JavaScript',
    why: 'Muchos rastreadores de IA no ejecutan JavaScript. Si el contenido solo aparece tras JS, no lo verán.',
    howToFix: 'Sirve el contenido principal en el HTML inicial (SSR/SSG) para que sea legible sin ejecutar JavaScript.',
    weight: 3,
  },

  // ── Bloque E · Rendimiento (stub) ─────────────────────────────────────────
  'perf.core-web-vitals': {
    label: 'Core Web Vitals',
    why: 'LCP, INP y CLS miden la experiencia real de carga e interacción y son factor de ranking.',
    howToFix: 'Requiere medición de campo/laboratorio en un backend. Disponible en la versión Pro.',
    weight: 1,
  },
};

/**
 * Build a full CheckResult by merging the dynamic part (status/value/message)
 * with the static catalog entry. Throws in dev if the id is unknown.
 */
export function buildCheck(
  id: string,
  status: CheckStatus,
  dynamic: { message: string; value?: string | number },
): CheckResult {
  const meta = CHECKS[id];
  if (!meta) {
    // Fail loud during development; this means a module referenced an unknown id.
    throw new Error(`Unknown check id: ${id}`);
  }
  return {
    id,
    label: meta.label,
    status,
    value: dynamic.value,
    message: dynamic.message,
    why: meta.why,
    howToFix: meta.howToFix,
    weight: meta.weight,
    docsRef: meta.docsRef,
  };
}

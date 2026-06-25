// Bloque B — On-page.

import type { CheckResult, CheckStatus } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';
import { getVisibleText, countWords, safeHost } from './utils';

const GENERIC_TITLES = [
  'home', 'inicio', 'untitled', 'sin título', 'document', 'new page',
  'página nueva', 'index', 'welcome', 'bienvenido',
];

export function analyzeOnPage(ctx: AnalysisContext): CheckResult[] {
  const { doc, html, parsedUrl } = ctx;
  const checks: CheckResult[] = [];

  // <title>
  const title = (doc.querySelector('title')?.textContent || '').trim();
  const titleLen = title.length;
  const generic = GENERIC_TITLES.includes(title.toLowerCase());
  let titleStatus: CheckStatus;
  let titleMsg: string;
  if (!title) {
    titleStatus = 'fail';
    titleMsg = 'No hay etiqueta <title>.';
  } else if (generic) {
    titleStatus = 'warn';
    titleMsg = `El title es genérico ("${title}").`;
  } else if (titleLen >= 50 && titleLen <= 60) {
    titleStatus = 'pass';
    titleMsg = `Title óptimo (${titleLen} caracteres).`;
  } else if (titleLen >= 30 && titleLen <= 70) {
    titleStatus = 'warn';
    titleMsg = `Title aceptable pero fuera del rango ideal de 50-60 (${titleLen} caracteres).`;
  } else {
    titleStatus = 'warn';
    titleMsg =
      titleLen < 30
        ? `Title demasiado corto (${titleLen} caracteres).`
        : `Title demasiado largo (${titleLen} caracteres); se truncará en los resultados.`;
  }
  checks.push(buildCheck('onpage.title', titleStatus, { value: titleLen, message: titleMsg }));

  // Meta description
  const desc = (
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  ).trim();
  const descLen = desc.length;
  let descStatus: CheckStatus;
  let descMsg: string;
  if (!desc) {
    descStatus = 'fail';
    descMsg = 'Falta la meta description.';
  } else if (descLen >= 120 && descLen <= 160) {
    descStatus = 'pass';
    descMsg = `Meta description óptima (${descLen} caracteres).`;
  } else {
    descStatus = 'warn';
    descMsg =
      descLen < 120
        ? `Meta description corta (${descLen} caracteres); ideal 120-160.`
        : `Meta description larga (${descLen} caracteres); se truncará.`;
  }
  checks.push(buildCheck('onpage.meta-description', descStatus, { value: descLen, message: descMsg }));

  // Single <h1>
  const h1s = doc.querySelectorAll('h1');
  let h1Status: CheckStatus;
  let h1Msg: string;
  if (h1s.length === 1) {
    h1Status = 'pass';
    h1Msg = 'Hay exactamente un <h1>.';
  } else if (h1s.length === 0) {
    h1Status = 'fail';
    h1Msg = 'No hay ningún <h1>.';
  } else {
    h1Status = 'warn';
    h1Msg = `Hay ${h1s.length} etiquetas <h1>; debería haber solo una.`;
  }
  checks.push(buildCheck('onpage.h1-single', h1Status, { value: h1s.length, message: h1Msg }));

  // Heading hierarchy (no skipped levels)
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) =>
    Number(h.tagName.substring(1)),
  );
  let skipped = false;
  let prev = 0;
  for (const level of headings) {
    if (prev !== 0 && level > prev + 1) {
      skipped = true;
      break;
    }
    prev = level;
  }
  if (headings.length === 0) {
    checks.push(
      buildCheck('onpage.heading-hierarchy', 'fail', {
        message: 'No hay encabezados que estructuren el contenido.',
      }),
    );
  } else {
    checks.push(
      buildCheck('onpage.heading-hierarchy', skipped ? 'warn' : 'pass', {
        value: `${headings.length} headings`,
        message: skipped
          ? 'La jerarquía de encabezados salta niveles (p. ej. de h2 a h4).'
          : 'La jerarquía de encabezados es coherente.',
      }),
    );
  }

  // Word count
  const text = getVisibleText(doc);
  const words = countWords(text);
  let wcStatus: CheckStatus;
  if (words >= 300) wcStatus = 'pass';
  else if (words >= 100) wcStatus = 'warn';
  else wcStatus = 'fail';
  checks.push(
    buildCheck('onpage.word-count', wcStatus, {
      value: words,
      message:
        wcStatus === 'pass'
          ? `Contenido con suficiente profundidad (${words} palabras).`
          : `Contenido breve (${words} palabras); amplíalo para aportar más valor.`,
    }),
  );

  // Text/HTML ratio
  const htmlLen = html.length || 1;
  const ratio = (text.length / htmlLen) * 100;
  let ratioStatus: CheckStatus;
  if (ratio >= 10) ratioStatus = 'pass';
  else if (ratio >= 4) ratioStatus = 'warn';
  else ratioStatus = 'fail';
  checks.push(
    buildCheck('onpage.text-html-ratio', ratioStatus, {
      value: `${ratio.toFixed(1)}%`,
      message:
        ratioStatus === 'pass'
          ? `Buen ratio texto/HTML (${ratio.toFixed(1)}%).`
          : `Ratio texto/HTML bajo (${ratio.toFixed(1)}%); demasiado marcado frente al texto.`,
    }),
  );

  // Images with alt
  const imgs = Array.from(doc.querySelectorAll('img'));
  const total = imgs.length;
  if (total === 0) {
    checks.push(
      buildCheck('onpage.img-alt', 'info', {
        message: 'No hay imágenes en la página.',
      }),
    );
  } else {
    const withAlt = imgs.filter((img) => img.getAttribute('alt') !== null).length;
    const pct = (withAlt / total) * 100;
    let altStatus: CheckStatus;
    if (pct === 100) altStatus = 'pass';
    else if (pct >= 60) altStatus = 'warn';
    else altStatus = 'fail';
    checks.push(
      buildCheck('onpage.img-alt', altStatus, {
        value: `${withAlt}/${total}`,
        message:
          altStatus === 'pass'
            ? 'Todas las imágenes tienen atributo alt.'
            : `Solo ${withAlt} de ${total} imágenes tienen alt.`,
      }),
    );
  }

  // Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDesc = doc.querySelector('meta[property="og:description"]');
  const ogImage = doc.querySelector('meta[property="og:image"]');
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  let ogStatus: CheckStatus;
  if (ogCount === 3) ogStatus = 'pass';
  else if (ogCount >= 1) ogStatus = 'warn';
  else ogStatus = 'fail';
  checks.push(
    buildCheck('onpage.open-graph', ogStatus, {
      value: `${ogCount}/3`,
      message:
        ogStatus === 'pass'
          ? 'Open Graph completo (title, description, image).'
          : ogCount === 0
            ? 'No hay etiquetas Open Graph.'
            : `Open Graph incompleto (${ogCount}/3): falta ${[
                !ogTitle && 'og:title',
                !ogDesc && 'og:description',
                !ogImage && 'og:image',
              ]
                .filter(Boolean)
                .join(', ')}.`,
    }),
  );

  // Twitter Cards
  const twCard = doc.querySelector('meta[name="twitter:card"]');
  checks.push(
    buildCheck('onpage.twitter-cards', twCard ? 'pass' : 'warn', {
      value: twCard?.getAttribute('content') || undefined,
      message: twCard
        ? 'Twitter Card declarada.'
        : 'No hay Twitter Cards; mejoran la presentación al compartir en X/Twitter.',
    }),
  );

  // Internal links
  const host = parsedUrl.host.toLowerCase();
  const anchors = Array.from(doc.querySelectorAll('a[href]'));
  const internal = anchors.filter((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
      return false;
    if (href.startsWith('/') && !href.startsWith('//')) return true;
    const h = safeHost(href, parsedUrl.href);
    return h === host;
  }).length;
  let linkStatus: CheckStatus;
  if (internal >= 3) linkStatus = 'pass';
  else if (internal >= 1) linkStatus = 'warn';
  else linkStatus = 'fail';
  checks.push(
    buildCheck('onpage.internal-links', linkStatus, {
      value: internal,
      message:
        linkStatus === 'pass'
          ? `${internal} enlaces internos detectados.`
          : internal === 0
            ? 'No hay enlaces internos; dificulta el descubrimiento y la distribución de autoridad.'
            : `Solo ${internal} enlace(s) interno(s); añade más para enlazar tu contenido.`,
    }),
  );

  return checks;
}

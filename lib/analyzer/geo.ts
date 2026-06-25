// Bloque D — GEO (Generative Engine Optimization). The differentiator.

import type { CheckResult, CheckStatus } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';
import { getVisibleText, countWords, firstWords } from './utils';

// ── AI bot catalog (2026). Claude-Web and anthropic-ai are obsolete → excluded.
type BotKind = 'training' | 'search';
interface AiBot {
  name: string;
  kind: BotKind;
  vendor: string;
}

export const AI_BOTS: AiBot[] = [
  // Training crawlers (use content to train models). Blocking is legitimate and
  // does NOT prevent citations.
  { name: 'GPTBot', kind: 'training', vendor: 'OpenAI' },
  { name: 'ClaudeBot', kind: 'training', vendor: 'Anthropic' },
  { name: 'Google-Extended', kind: 'training', vendor: 'Google' },
  { name: 'Applebot-Extended', kind: 'training', vendor: 'Apple' },
  // Search / RAG crawlers (power live retrieval + citations). Blocking these
  // means your site cannot be cited in AI answers.
  { name: 'OAI-SearchBot', kind: 'search', vendor: 'OpenAI' },
  { name: 'ChatGPT-User', kind: 'search', vendor: 'OpenAI' },
  { name: 'Claude-SearchBot', kind: 'search', vendor: 'Anthropic' },
  { name: 'Claude-User', kind: 'search', vendor: 'Anthropic' },
  { name: 'PerplexityBot', kind: 'search', vendor: 'Perplexity' },
  { name: 'Perplexity-User', kind: 'search', vendor: 'Perplexity' },
];

interface RobotsGroup {
  agents: string[];
  rules: { allow: boolean; path: string }[];
}

/** Minimal robots.txt parser grouping rules by User-agent. */
export function parseRobots(body: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let expectingAgent = false;

  for (const rawLine of body.split('\n')) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === 'user-agent') {
      if (!expectingAgent || !current) {
        current = { agents: [], rules: [] };
        groups.push(current);
        expectingAgent = true;
      }
      current.agents.push(value.toLowerCase());
    } else if (field === 'allow' || field === 'disallow') {
      if (!current) {
        current = { agents: ['*'], rules: [] };
        groups.push(current);
      }
      expectingAgent = false;
      current.rules.push({ allow: field === 'allow', path: value });
    } else {
      expectingAgent = false;
    }
  }
  return groups;
}

/**
 * Determine whether `botName` may crawl the root path "/". Applies the most
 * specific matching group (bot-specific overrides "*") and longest-match
 * precedence between Allow/Disallow, per the robots.txt convention.
 */
export function isBotAllowed(groups: RobotsGroup[], botName: string): boolean {
  const lower = botName.toLowerCase();
  const specific = groups.filter((g) => g.agents.includes(lower));
  const wildcard = groups.filter((g) => g.agents.includes('*'));
  const applicable = specific.length ? specific : wildcard;
  if (!applicable.length) return true; // no rules → allowed

  const rules = applicable.flatMap((g) => g.rules);
  if (!rules.length) return true;

  // Match against root "/". Longest matching path wins; ties favour Allow.
  let decision = true;
  let bestLen = -1;
  for (const r of rules) {
    if (r.path === '') {
      // "Disallow:" empty means allow all; treat as zero-length allow.
      if (r.allow === false && bestLen < 0) {
        decision = true;
        bestLen = 0;
      }
      continue;
    }
    // Does this rule's path apply to "/"? A rule path of "/" or "/" prefix.
    const applies = '/'.startsWith(r.path) || r.path === '/';
    if (applies && r.path.length >= bestLen) {
      decision = r.allow;
      bestLen = r.path.length;
    }
  }
  return decision;
}

export function analyzeGeo(ctx: AnalysisContext): CheckResult[] {
  const { doc, robots, llms } = ctx;
  const checks: CheckResult[] = [];
  const text = getVisibleText(doc);
  const words = countWords(text);

  // ── AI bots in robots.txt ────────────────────────────────────────────────
  const groups = robots.ok ? parseRobots(robots.body) : [];
  const status = AI_BOTS.map((bot) => ({
    bot,
    allowed: robots.ok ? isBotAllowed(groups, bot.name) : true,
  }));

  const searchBots = status.filter((s) => s.bot.kind === 'search');
  const blockedSearch = searchBots.filter((s) => !s.allowed);
  const searchSummary = searchBots
    .map((s) => `${s.allowed ? '✓' : '✗'} ${s.bot.name}`)
    .join(', ');

  let searchStatus: CheckStatus;
  let searchMsg: string;
  if (!robots.ok) {
    searchStatus = 'pass';
    searchMsg =
      'Sin robots.txt: por defecto todos los bots de búsqueda de IA pueden rastrear y citar la página.';
  } else if (blockedSearch.length === searchBots.length) {
    searchStatus = 'fail';
    searchMsg = `Todos los bots de búsqueda de IA están bloqueados: tu contenido no podrá citarse en IA. (${searchSummary})`;
  } else if (blockedSearch.length > 0) {
    searchStatus = 'warn';
    searchMsg = `${blockedSearch.length} de ${searchBots.length} bots de búsqueda de IA bloqueados. (${searchSummary})`;
  } else {
    searchStatus = 'pass';
    searchMsg = `Todos los bots de búsqueda de IA pueden rastrear la página. (${searchSummary})`;
  }
  checks.push(
    buildCheck('geo.ai-search-bots', searchStatus, {
      value: `${searchBots.length - blockedSearch.length}/${searchBots.length} permitidos`,
      message: searchMsg,
    }),
  );

  // Training bots — informational (blocking is a legitimate choice, no GEO hit).
  const trainingBots = status.filter((s) => s.bot.kind === 'training');
  const blockedTraining = trainingBots.filter((s) => !s.allowed);
  const trainingSummary = trainingBots
    .map((s) => `${s.allowed ? '✓' : '✗'} ${s.bot.name}`)
    .join(', ');
  checks.push(
    buildCheck('geo.ai-training-bots', 'info', {
      value: `${trainingBots.length - blockedTraining.length}/${trainingBots.length} permitidos`,
      message: robots.ok
        ? `Bots de entrenamiento: ${blockedTraining.length} bloqueados. Es una decisión legítima y no afecta a las citas. (${trainingSummary})`
        : 'Sin robots.txt: todos los bots de entrenamiento pueden usar el contenido.',
    }),
  );

  // ── llms.txt ─────────────────────────────────────────────────────────────
  if (!llms.ok) {
    checks.push(
      buildCheck('geo.llms-txt', 'fail', {
        message: 'No se encontró /llms.txt.',
      }),
    );
  } else {
    const hasHeading = /^#\s+/m.test(llms.body) || /^#\s/.test(llms.body.trim());
    const hasLinks = /\[.+?\]\(.+?\)/.test(llms.body);
    const structured = hasHeading || hasLinks;
    checks.push(
      buildCheck('geo.llms-txt', structured ? 'pass' : 'warn', {
        message: structured
          ? 'llms.txt presente con estructura (encabezados/enlaces Markdown).'
          : 'llms.txt presente pero sin una estructura Markdown reconocible.',
      }),
    );
  }

  // ── BLUF / Answer capsule (first ~150 words) ─────────────────────────────
  const paragraphs = Array.from(doc.querySelectorAll('article p, main p, p'))
    .map((p) => (p.textContent || '').trim())
    .filter(Boolean);
  const firstSubstantial = paragraphs.find((p) => countWords(p) >= 25);
  const opening = firstWords(text, 150);
  const openingHasSubstance =
    !!firstSubstantial && opening.includes(firstWords(firstSubstantial, 8));
  let blufStatus: CheckStatus;
  let blufMsg: string;
  if (!firstSubstantial) {
    blufStatus = 'fail';
    blufMsg = 'No hay un párrafo sustancial al inicio que actúe como respuesta directa.';
  } else if (openingHasSubstance) {
    blufStatus = 'pass';
    blufMsg = 'Hay un párrafo con respuesta directa dentro de las primeras ~150 palabras.';
  } else {
    blufStatus = 'warn';
    blufMsg = 'Hay contenido sustancial, pero la respuesta directa no aparece al principio.';
  }
  checks.push(buildCheck('geo.bluf', blufStatus, { message: blufMsg }));

  // ── Data density (numbers/stats/percentages) ─────────────────────────────
  const dataMatches = text.match(/\b\d+([.,]\d+)?\s?(%|por ciento|€|\$|millones?|mil)?\b/gi) || [];
  const percentMatches = text.match(/\d+([.,]\d+)?\s?%/g) || [];
  const dataCount = dataMatches.length;
  const density = words > 0 ? dataCount / words : 0;
  let dataStatus: CheckStatus;
  if (dataCount >= 8 && density >= 0.01) dataStatus = 'pass';
  else if (dataCount >= 3) dataStatus = 'warn';
  else dataStatus = 'fail';
  checks.push(
    buildCheck('geo.data-density', dataStatus, {
      value: `${dataCount} cifras${percentMatches.length ? `, ${percentMatches.length} %` : ''}`,
      message:
        dataStatus === 'pass'
          ? 'Buena densidad de datos concretos (cifras, porcentajes); contenido citable.'
          : dataStatus === 'warn'
            ? 'Pocos datos concretos; añade más cifras verificables.'
            : 'Apenas hay datos concretos; el contenido es difícil de citar por la IA.',
    }),
  );

  // ── Promotional tone ─────────────────────────────────────────────────────
  const promoPhrases = [
    'la mejor opción', 'el mejor', 'la mejor', 'esencial', 'imprescindible',
    'actúa ya', 'sin duda', 'líder', 'revolucionario', 'único en el mercado',
    'no te lo pierdas', 'compra ya', 'oferta única', 'world-class', 'best option',
    'must-have', 'act now', 'game-changer', 'cutting-edge', 'number one',
    'el número uno', 'incomparable', 'inigualable',
  ];
  const lowerText = text.toLowerCase();
  const promoHits = promoPhrases.filter((p) => lowerText.includes(p));
  let promoStatus: CheckStatus;
  if (promoHits.length === 0) promoStatus = 'pass';
  else if (promoHits.length <= 3) promoStatus = 'warn';
  else promoStatus = 'fail';
  checks.push(
    buildCheck('geo.promotional-tone', promoStatus, {
      value: `${promoHits.length} expresiones`,
      message:
        promoStatus === 'pass'
          ? 'Tono neutral y objetivo, adecuado para ser citado por la IA.'
          : `Se detectó lenguaje promocional (${promoHits.slice(0, 4).join(', ')}${
              promoHits.length > 4 ? '…' : ''
            }) que reduce la credibilidad ante la IA.`,
    }),
  );

  // ── Q&A format (questions as headings) ───────────────────────────────────
  const headings = Array.from(doc.querySelectorAll('h2, h3, h4')).map((h) =>
    (h.textContent || '').trim(),
  );
  const questionRe = /\?|^(qué|cómo|por qué|cuándo|dónde|cuál|quién|cuánto|what|how|why|when|where|which|who)\b/i;
  const questionHeadings = headings.filter((h) => questionRe.test(h));
  checks.push(
    buildCheck('geo.qa-format', questionHeadings.length >= 2 ? 'pass' : 'warn', {
      value: `${questionHeadings.length} preguntas`,
      message:
        questionHeadings.length >= 2
          ? 'El contenido usa preguntas como encabezados (formato Q&A).'
          : 'Pocas o ninguna pregunta como encabezado; el formato Q&A favorece la extracción por IA.',
    }),
  );

  // ── Tables ───────────────────────────────────────────────────────────────
  const tables = doc.querySelectorAll('table').length;
  checks.push(
    buildCheck('geo.tables', tables > 0 ? 'pass' : 'warn', {
      value: tables,
      message:
        tables > 0
          ? `Hay ${tables} tabla(s) de datos, fáciles de extraer por la IA.`
          : 'No hay tablas; para datos comparables, una tabla es más citable que el texto.',
    }),
  );

  // ── Video transcript ─────────────────────────────────────────────────────
  const videos = doc.querySelectorAll('video').length;
  const embeds = doc.querySelectorAll(
    'iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"], iframe[src*="wistia"]',
  ).length;
  const mediaCount = videos + embeds;
  if (mediaCount === 0) {
    checks.push(
      buildCheck('geo.transcript', 'na', {
        message: 'No hay vídeos ni embeds que requieran transcripción.',
      }),
    );
  } else {
    const hasTrack = doc.querySelector('track[kind="captions"], track[kind="subtitles"]');
    const mentionsTranscript = /transcripci[oó]n|transcript/i.test(text);
    const hasTranscript = !!hasTrack || mentionsTranscript;
    checks.push(
      buildCheck('geo.transcript', hasTranscript ? 'pass' : 'warn', {
        value: `${mediaCount} medios`,
        message: hasTranscript
          ? 'Se detecta transcripción/subtítulos junto al contenido audiovisual.'
          : 'Hay vídeo/embed sin transcripción textual; ese contenido es invisible para la IA.',
      }),
    );
  }

  // ── Semantic HTML vs div-soup ────────────────────────────────────────────
  const semanticCount =
    doc.querySelectorAll('article, section, main, header, footer, nav, aside, figure').length;
  const divCount = doc.querySelectorAll('div').length;
  const hasArticleOrMain = !!doc.querySelector('article, main');
  let semStatus: CheckStatus;
  let semMsg: string;
  if (semanticCount === 0) {
    semStatus = 'fail';
    semMsg = `Estructura tipo "div-soup" (${divCount} divs, 0 elementos semánticos).`;
  } else if (hasArticleOrMain && semanticCount >= 3) {
    semStatus = 'pass';
    semMsg = `Buen HTML semántico (${semanticCount} elementos semánticos).`;
  } else {
    semStatus = 'warn';
    semMsg = `Algo de HTML semántico (${semanticCount} elementos), pero predominan los divs (${divCount}).`;
  }
  checks.push(buildCheck('geo.semantic-html', semStatus, { value: semanticCount, message: semMsg }));

  // ── JavaScript dependency (heuristic) ────────────────────────────────────
  const scriptSrc = doc.querySelectorAll('script[src]').length;
  const spaRoot = doc.querySelector('#root, #__next, #app, [data-reactroot]');
  const noscriptWarn = /enable javascript|activa(r)? javascript|requires javascript/i.test(
    doc.querySelector('noscript')?.textContent || '',
  );
  let jsStatus: CheckStatus;
  let jsMsg: string;
  if (words < 50 && (scriptSrc > 0 || spaRoot)) {
    jsStatus = 'fail';
    jsMsg = `El HTML inicial casi no tiene texto (${words} palabras) y depende de JavaScript: invisible para muchos rastreadores de IA.`;
  } else if ((words < 200 && scriptSrc > 5) || (spaRoot && words < 300) || noscriptWarn) {
    jsStatus = 'warn';
    jsMsg = `Posible dependencia de JavaScript (${words} palabras en HTML, ${scriptSrc} scripts).`;
  } else {
    jsStatus = 'pass';
    jsMsg = `El contenido principal está en el HTML inicial (${words} palabras), legible sin ejecutar JavaScript.`;
  }
  checks.push(buildCheck('geo.js-dependency', jsStatus, { value: `${words} palabras`, message: jsMsg }));

  return checks;
}

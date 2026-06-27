// Bloque D — GEO (Generative Engine Optimization). The differentiator.

import type { CheckResult, CheckStatus } from '../types';
import { buildCheck } from '../checks-catalog';
import type { AnalysisContext } from './context';
import { getVisibleText, countWords, firstWords, truncate } from './utils';

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
  let searchKey: string;
  let searchParams: Record<string, string | number> | undefined;
  if (!robots.ok) {
    searchStatus = 'pass';
    searchKey = 'geo.aiSearchBots.noRobots';
  } else if (blockedSearch.length === searchBots.length) {
    searchStatus = 'fail';
    searchKey = 'geo.aiSearchBots.allBlocked';
    searchParams = { summary: searchSummary };
  } else if (blockedSearch.length > 0) {
    searchStatus = 'warn';
    searchKey = 'geo.aiSearchBots.someBlocked';
    searchParams = { blocked: blockedSearch.length, total: searchBots.length, summary: searchSummary };
  } else {
    searchStatus = 'pass';
    searchKey = 'geo.aiSearchBots.allowed';
    searchParams = { summary: searchSummary };
  }
  const blockedSearchNames = blockedSearch.map((s) => s.bot.name).join(', ');
  const allowedSearchNames = searchBots.filter((s) => s.allowed).map((s) => s.bot.name).join(', ');
  const searchEvidence: { labelKey: string; value: string }[] = [];
  if (robots.ok && blockedSearchNames) {
    searchEvidence.push({ labelKey: 'evidence.bots.blocked', value: blockedSearchNames });
  }
  if (robots.ok && allowedSearchNames) {
    searchEvidence.push({ labelKey: 'evidence.bots.allowed', value: allowedSearchNames });
  }
  checks.push(
    buildCheck('geo.ai-search-bots', searchStatus, {
      valueKey: 'botsAllowed',
      valueParams: { allowed: searchBots.length - blockedSearch.length, total: searchBots.length },
      messageKey: searchKey,
      messageParams: searchParams,
      evidence: searchEvidence.length ? searchEvidence : undefined,
    }),
  );

  // Training bots — informational (blocking is a legitimate choice, no GEO hit).
  const trainingBots = status.filter((s) => s.bot.kind === 'training');
  const blockedTraining = trainingBots.filter((s) => !s.allowed);
  const trainingSummary = trainingBots
    .map((s) => `${s.allowed ? '✓' : '✗'} ${s.bot.name}`)
    .join(', ');
  const blockedTrainingNames = blockedTraining.map((s) => s.bot.name).join(', ');
  checks.push(
    buildCheck('geo.ai-training-bots', 'info', {
      valueKey: 'botsAllowed',
      valueParams: { allowed: trainingBots.length - blockedTraining.length, total: trainingBots.length },
      messageKey: robots.ok ? 'geo.aiTrainingBots.info' : 'geo.aiTrainingBots.noRobots',
      messageParams: robots.ok
        ? { blocked: blockedTraining.length, summary: trainingSummary }
        : undefined,
      evidence:
        robots.ok && blockedTrainingNames
          ? [{ labelKey: 'evidence.bots.trainingBlocked', value: blockedTrainingNames }]
          : undefined,
    }),
  );

  // ── llms.txt ─────────────────────────────────────────────────────────────
  const llmsUrl = `${ctx.parsedUrl.origin}/llms.txt`;
  if (!llms.ok) {
    checks.push(
      buildCheck('geo.llms-txt', 'fail', {
        messageKey: 'geo.llmsTxt.missing',
        evidence: [{ labelKey: 'evidence.llms.url', value: llmsUrl }],
      }),
    );
  } else {
    const hasHeading = /^#\s+/m.test(llms.body) || /^#\s/.test(llms.body.trim());
    const hasLinks = /\[.+?\]\(.+?\)/.test(llms.body);
    const structured = hasHeading || hasLinks;
    const firstHeading = (llms.body.split('\n').find((l) => /^#\s+/.test(l.trim())) || '')
      .replace(/^#+\s*/, '')
      .trim();
    const llmsEvidence = [{ labelKey: 'evidence.llms.url', value: llmsUrl }];
    if (firstHeading) {
      llmsEvidence.push({ labelKey: 'evidence.llms.firstHeading', value: truncate(firstHeading, 120) });
    }
    checks.push(
      buildCheck('geo.llms-txt', structured ? 'pass' : 'warn', {
        messageKey: structured ? 'geo.llmsTxt.structured' : 'geo.llmsTxt.unstructured',
        evidence: llmsEvidence,
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
  let blufKey: string;
  if (!firstSubstantial) {
    blufStatus = 'fail';
    blufKey = 'geo.bluf.none';
  } else if (openingHasSubstance) {
    blufStatus = 'pass';
    blufKey = 'geo.bluf.ok';
  } else {
    blufStatus = 'warn';
    blufKey = 'geo.bluf.notLeading';
  }
  checks.push(
    buildCheck('geo.bluf', blufStatus, {
      messageKey: blufKey,
      evidence: firstSubstantial
        ? [{ labelKey: 'evidence.bluf.opening', value: truncate(opening, 200) }]
        : undefined,
    }),
  );

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
      valueKey: percentMatches.length ? 'figuresPct' : 'figures',
      valueParams: percentMatches.length
        ? { n: dataCount, pct: percentMatches.length }
        : { n: dataCount },
      messageKey:
        dataStatus === 'pass'
          ? 'geo.dataDensity.ok'
          : dataStatus === 'warn'
            ? 'geo.dataDensity.few'
            : 'geo.dataDensity.none',
      evidence: [
        { labelKey: 'evidence.dataDensity.figures', value: dataCount },
        { labelKey: 'evidence.dataDensity.percents', value: percentMatches.length },
      ],
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
  const promoHitsStr = `${promoHits.slice(0, 4).join(', ')}${promoHits.length > 4 ? '…' : ''}`;
  checks.push(
    buildCheck('geo.promotional-tone', promoStatus, {
      valueKey: 'expressions',
      valueParams: { n: promoHits.length },
      messageKey: promoStatus === 'pass' ? 'geo.promotionalTone.neutral' : 'geo.promotionalTone.promo',
      messageParams: promoStatus === 'pass' ? undefined : { hits: promoHitsStr },
      evidence:
        promoStatus === 'pass'
          ? undefined
          : [{ labelKey: 'evidence.promo.hits', value: truncate(promoHits.join(', '), 200) }],
    }),
  );

  // ── Q&A format (questions as headings) ───────────────────────────────────
  const headings = Array.from(doc.querySelectorAll('h2, h3, h4')).map((h) =>
    (h.textContent || '').trim(),
  );
  const questionRe = /\?|^(qué|cómo|por qué|cuándo|dónde|cuál|quién|cuánto|what|how|why|when|where|which|who)\b/i;
  const questionHeadings = headings.filter((h) => questionRe.test(h));
  const qaEvidence: { labelKey: string; value: string | number }[] = [
    { labelKey: 'evidence.qa.count', value: questionHeadings.length },
  ];
  if (questionHeadings.length > 0) {
    qaEvidence.push({
      labelKey: 'evidence.qa.samples',
      value: questionHeadings.slice(0, 2).map((h) => truncate(h, 80)).join(' · '),
    });
  }
  checks.push(
    buildCheck('geo.qa-format', questionHeadings.length >= 2 ? 'pass' : 'warn', {
      valueKey: 'questions',
      valueParams: { n: questionHeadings.length },
      messageKey: questionHeadings.length >= 2 ? 'geo.qaFormat.ok' : 'geo.qaFormat.few',
      evidence: qaEvidence,
    }),
  );

  // ── Tables ───────────────────────────────────────────────────────────────
  const tables = doc.querySelectorAll('table').length;
  checks.push(
    buildCheck('geo.tables', tables > 0 ? 'pass' : 'warn', {
      value: tables,
      messageKey: tables > 0 ? 'geo.tables.ok' : 'geo.tables.none',
      messageParams: tables > 0 ? { count: tables } : undefined,
      evidence: tables > 0 ? [{ labelKey: 'evidence.tables.count', value: tables }] : undefined,
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
        messageKey: 'geo.transcript.na',
      }),
    );
  } else {
    const hasTrack = doc.querySelector('track[kind="captions"], track[kind="subtitles"]');
    const mentionsTranscript = /transcripci[oó]n|transcript/i.test(text);
    const hasTranscript = !!hasTrack || mentionsTranscript;
    checks.push(
      buildCheck('geo.transcript', hasTranscript ? 'pass' : 'warn', {
        valueKey: 'media',
        valueParams: { n: mediaCount },
        messageKey: hasTranscript ? 'geo.transcript.ok' : 'geo.transcript.missing',
        evidence: [{ labelKey: 'evidence.transcript.mediaCount', value: mediaCount }],
      }),
    );
  }

  // ── Semantic HTML vs div-soup ────────────────────────────────────────────
  const semanticCount =
    doc.querySelectorAll('article, section, main, header, footer, nav, aside, figure').length;
  const divCount = doc.querySelectorAll('div').length;
  const hasArticleOrMain = !!doc.querySelector('article, main');
  let semStatus: CheckStatus;
  let semKey: string;
  let semParams: Record<string, string | number>;
  if (semanticCount === 0) {
    semStatus = 'fail';
    semKey = 'geo.semanticHtml.divSoup';
    semParams = { divs: divCount };
  } else if (hasArticleOrMain && semanticCount >= 3) {
    semStatus = 'pass';
    semKey = 'geo.semanticHtml.good';
    semParams = { count: semanticCount };
  } else {
    semStatus = 'warn';
    semKey = 'geo.semanticHtml.some';
    semParams = { count: semanticCount, divs: divCount };
  }
  checks.push(
    buildCheck('geo.semantic-html', semStatus, {
      value: semanticCount,
      messageKey: semKey,
      messageParams: semParams,
      evidence: [
        { labelKey: 'evidence.semantic.semanticCount', value: semanticCount },
        { labelKey: 'evidence.semantic.divCount', value: divCount },
      ],
    }),
  );

  // ── JavaScript dependency (heuristic) ────────────────────────────────────
  const scriptSrc = doc.querySelectorAll('script[src]').length;
  const spaRoot = doc.querySelector('#root, #__next, #app, [data-reactroot]');
  const noscriptWarn = /enable javascript|activa(r)? javascript|requires javascript/i.test(
    doc.querySelector('noscript')?.textContent || '',
  );
  let jsStatus: CheckStatus;
  let jsKey: string;
  let jsParams: Record<string, string | number>;
  if (words < 50 && (scriptSrc > 0 || spaRoot)) {
    jsStatus = 'fail';
    jsKey = 'geo.jsDependency.fail';
    jsParams = { words };
  } else if ((words < 200 && scriptSrc > 5) || (spaRoot && words < 300) || noscriptWarn) {
    jsStatus = 'warn';
    jsKey = 'geo.jsDependency.warn';
    jsParams = { words, scripts: scriptSrc };
  } else {
    jsStatus = 'pass';
    jsKey = 'geo.jsDependency.pass';
    jsParams = { words };
  }
  checks.push(
    buildCheck('geo.js-dependency', jsStatus, {
      valueKey: 'words',
      valueParams: { n: words },
      messageKey: jsKey,
      messageParams: jsParams,
      evidence: [
        { labelKey: 'evidence.js.words', value: words },
        { labelKey: 'evidence.js.scripts', value: scriptSrc },
      ],
    }),
  );

  return checks;
}

// English dictionary — the canonical/base language and the single source of
// truth for every translation key. Other languages must mirror this shape
// (enforced by the `Dictionary` type derived from this object).
//
// Conventions:
// - `msg.*`  : dynamic check messages emitted by the analyzers (may use {params}).
// - `val.*`  : localized "value" pills shown on a check row (may use {params}).
// - `check.*`: static per-check copy (label / why / howToFix), keyed by check id.
// - `{name}` : interpolated parameter. A param whose value is an array is treated
//              as a list of message keys, each translated and concatenated.

const en = {
  nav: {
    getHelp: 'Get help',
    language: 'Language',
  },

  landing: {
    titleBefore: 'Is your page ready for ',
    titleSeo: 'SEO',
    titleMid: ' and ',
    titleAi: 'AI',
    titleAfter: '?',
    subtitle:
      'Analyze any URL and discover how optimized it is for classic SEO and for GEO — being cited in answers from ChatGPT, Claude and Perplexity.',
  },

  url: {
    placeholder: 'enter-a-url.com',
    analyze: 'Analyze',
    analyzing: 'Analyzing…',
    errorEmpty: 'Enter a URL to analyze.',
    errorInvalid: 'That URL does not look valid.',
    ariaLabel: 'URL to analyze',
  },

  loading: {
    title: 'Analyzing',
  },

  steps: {
    'fetch-html': 'Reading the page HTML',
    'fetch-robots': 'Parsing robots.txt',
    'fetch-sitemap': 'Checking sitemap.xml',
    'fetch-llms': 'Looking for llms.txt',
    'analyze-technical': 'Evaluating technical SEO',
    'analyze-onpage': 'Evaluating on-page content',
    'analyze-schema': 'Evaluating structured data',
    'analyze-geo': 'Evaluating GEO (AI engines)',
    scoring: 'Computing score',
  },

  status: {
    pass: 'Pass',
    warn: 'Could be better',
    fail: 'Fail',
    info: 'Info',
    na: 'N/A',
  },

  category: {
    technical: 'Technical SEO',
    onpage: 'On-page',
    schema: 'Structured data',
    geo: 'GEO',
    performance: 'Performance',
  },

  score: {
    critical: 'Critical',
    improvable: 'Needs work',
    good: 'Good',
    excellent: 'Excellent',
  },

  dashboard: {
    heroAria: 'Global score',
    heroSub:
      'Global score combining classic SEO and GEO (optimization for AI engines).',
    analyzedAt: 'Analyzed on {date} · via {proxy}',
    direct: 'direct',
    reanalyze: 'Re-analyze',
    newUrl: 'Analyze another URL',
    warningsTitle: 'Warnings:',
    filterShow: 'Show:',
    filterAll: 'All',
    filterFail: 'Failures only',
    filterWarn: 'Improvable only',
    filterAria: 'Filter checks',
    categoryEmpty: 'Nothing matches this filter in this category.',
    kpis: {
      title: 'Overview',
      pass: 'Passing',
      warn: 'Improvable',
      fail: 'Failing',
      checks: '{n} checks',
    },
    distribution: {
      title: 'Status distribution',
    },
    ranking: {
      title: 'Categories by impact',
      subtitle: 'Biggest opportunities first',
      impact: 'Impact {n}',
    },
    priority: {
      title: 'Priority recommendations',
      subtitle: 'Sorted by weight × severity',
      empty: 'No failing or improvable checks — great job.',
      inCategory: '{category}',
    },
  },

  tour: {
    toggle: 'Guided help',
    close: 'Close',
    title: 'Guided help',
    hint: 'Tap any check to learn what it is, how it should work and why it matters.',
  },

  report: {
    title: 'SEO + GEO analysis',
    intro:
      "This is an automated SEO + GEO (Generative Engine Optimization) audit. GEO measures how well the page can be discovered and cited by AI answer engines such as ChatGPT, Claude and Perplexity. Based on the findings below, give a prioritized, concrete action plan to improve this page's SEO and GEO.",
    url: 'URL',
    analyzed: 'Analyzed',
    overall: 'Overall score',
    scores: 'Scores by category',
    findings: 'Findings',
    priority: 'Priority recommendations (by impact)',
    finding: 'Finding',
    fix: 'How to fix',
    performanceNote: 'not measured (requires a backend)',
    copy: 'Copy AI report',
    download: 'Download',
    copied: 'Copied!',
  },

  categoryCard: {
    lockedAria: '{label} (locked)',
    lockedBody:
      'Measuring Core Web Vitals (LCP, INP, CLS) requires a backend with field data and cannot run safely in the browser.',
    proCta: 'Available in the Pro version',
    scoreAria: '{label} sub-score',
  },

  detail: {
    what: 'What it is',
    found: 'What we found',
    why: 'Why it matters',
    howToFix: 'How to fix it',
    moreInfo: 'Learn more ↗',
  },

  errors: {
    unknown: 'Unknown error while analyzing.',
    fetchFailed:
      'Could not fetch the page. Check the URL or try again. ({detail})',
    noDetails: 'no details',
  },

  warnings: {
    robots: 'Could not fetch robots.txt.',
    sitemap: 'Could not fetch sitemap.xml.',
  },

  // ── Dynamic analyzer messages ──────────────────────────────────────────────
  msg: {
    tech: {
      https: {
        pass: 'The page is served over HTTPS.',
        fail: 'The page does not use HTTPS; the connection is not encrypted.',
      },
      httpStatus: {
        proxy:
          'The HTTP status is not observable through the proxy; content was retrieved, so the page responds.',
        ok: 'The page responds {status} OK.',
        other: 'The page responds {status}.',
      },
      htmlLang: {
        pass: 'Declared language: "{lang}".',
        fail: 'The lang attribute is missing on the <html> tag.',
      },
      viewport: {
        pass: 'Meta viewport present; the page is responsive-ready.',
        fail: 'Meta viewport missing; the page will not adapt to mobile.',
      },
      canonical: {
        missing: 'No canonical tag found.',
        ok: 'Canonical present and well-formed.',
        notAbsolute: 'Canonical present but not a valid absolute URL.',
      },
      metaRobots: {
        blocks: 'Meta robots blocks indexing/following ("{value}").',
        ok: 'Meta robots does not block indexing.',
      },
      robotsTxt: {
        missing: 'Could not fetch /robots.txt or it does not exist.',
        valid: 'robots.txt exists and contains valid directives.',
        invalid:
          'robots.txt exists but contains no recognizable User-agent directives.',
      },
      sitemap: {
        missingRef:
          'robots.txt references a sitemap, but /sitemap.xml did not respond.',
        missing: 'No /sitemap.xml found and no reference in robots.txt.',
        invalid: 'sitemap.xml responds but does not look like valid sitemap XML.',
        validRef: 'sitemap.xml is valid and referenced from robots.txt.',
        validNoRef: 'sitemap.xml is valid, but not referenced in robots.txt.',
      },
      urlClean: {
        dirty: 'URL could be improved{reasons}.',
        clean: 'Clean, readable URL.',
        tracking: ' (tracking parameters)',
        depth: ' (deep path)',
        upper: ' (uppercase)',
      },
    },
    onpage: {
      title: {
        missing: 'There is no <title> tag.',
        generic: 'The title is generic ("{title}").',
        optimal: 'Optimal title ({len} characters).',
        acceptable:
          'Acceptable title but outside the ideal 50-60 range ({len} characters).',
        short: 'Title too short ({len} characters).',
        long: 'Title too long ({len} characters); it will be truncated in results.',
      },
      metaDescription: {
        missing: 'The meta description is missing.',
        optimal: 'Optimal meta description ({len} characters).',
        short: 'Short meta description ({len} characters); ideal is 120-160.',
        long: 'Long meta description ({len} characters); it will be truncated.',
      },
      h1Single: {
        one: 'There is exactly one <h1>.',
        none: 'There is no <h1>.',
        many: 'There are {count} <h1> tags; there should be only one.',
      },
      headingHierarchy: {
        none: 'There are no headings to structure the content.',
        skipped: 'The heading hierarchy skips levels (e.g. from h2 to h4).',
        ok: 'The heading hierarchy is consistent.',
      },
      wordCount: {
        ok: 'Content has enough depth ({words} words).',
        short: 'Thin content ({words} words); expand it to add more value.',
      },
      textHtmlRatio: {
        ok: 'Good text/HTML ratio ({ratio}).',
        low: 'Low text/HTML ratio ({ratio}); too much markup versus text.',
      },
      imgAlt: {
        none: 'There are no images on the page.',
        all: 'Every image has an alt attribute.',
        partial: 'Only {withAlt} of {total} images have alt.',
      },
      openGraph: {
        complete: 'Open Graph complete (title, description, image).',
        none: 'No Open Graph tags.',
        partial: 'Open Graph incomplete ({count}/3): missing {missing}.',
      },
      twitterCards: {
        present: 'Twitter Card declared.',
        missing:
          'No Twitter Cards; they improve presentation when sharing on X/Twitter.',
      },
      internalLinks: {
        ok: '{count} internal links detected.',
        none:
          'No internal links; this hinders discovery and authority distribution.',
        few: 'Only {count} internal link(s); add more to link your content.',
      },
    },
    schema: {
      jsonldPresent: {
        present: 'Found {blocks} JSON-LD block(s).',
        none: 'No JSON-LD structured data.',
      },
      typesDetected: {
        na: 'No JSON-LD to analyze.',
        detected: 'Detected types: {types}.',
        noType: 'There is JSON-LD but no recognizable @type.',
      },
      orgSameas: {
        noOrg: 'No Organization schema on the page.',
        has: 'Organization includes sameAs with linked profiles.',
        missing:
          'Organization without sameAs; add the official profiles to reinforce the entity.',
      },
      authorProfile: {
        na: 'Not editorial content (Article/ProfilePage); not applicable.',
        has: 'The editorial content declares an author.',
        missing:
          'Editorial content without a declared author; add author (Person) for E-E-A-T.',
      },
      syntaxValid: {
        na: 'No JSON-LD to validate.',
        valid: 'All JSON-LD blocks have valid syntax.',
        invalid:
          '{invalid} of {blocks} JSON-LD block(s) have syntax errors and will be ignored.',
      },
    },
    geo: {
      aiSearchBots: {
        noRobots:
          'No robots.txt: by default every AI search bot can crawl and cite the page.',
        allBlocked:
          'Every AI search bot is blocked: your content cannot be cited in AI. ({summary})',
        someBlocked:
          '{blocked} of {total} AI search bots blocked. ({summary})',
        allowed: 'Every AI search bot can crawl the page. ({summary})',
      },
      aiTrainingBots: {
        info:
          'Training bots: {blocked} blocked. This is a legitimate choice and does not affect citations. ({summary})',
        noRobots: 'No robots.txt: every training bot can use the content.',
      },
      llmsTxt: {
        missing: 'No /llms.txt found.',
        structured:
          'llms.txt present with structure (Markdown headings/links).',
        unstructured:
          'llms.txt present but without recognizable Markdown structure.',
      },
      bluf: {
        none:
          'There is no substantial opening paragraph acting as a direct answer.',
        ok: 'There is a direct-answer paragraph within the first ~150 words.',
        notLeading:
          'There is substantial content, but the direct answer does not appear at the start.',
      },
      dataDensity: {
        ok: 'Good density of concrete data (figures, percentages); citable content.',
        few: 'Few concrete data points; add more verifiable figures.',
        none:
          'Almost no concrete data; the content is hard for AI to cite.',
      },
      promotionalTone: {
        neutral: 'Neutral, objective tone, suitable to be cited by AI.',
        promo:
          'Promotional language detected ({hits}) that reduces credibility with AI.',
      },
      qaFormat: {
        ok: 'The content uses questions as headings (Q&A format).',
        few:
          'Few or no questions as headings; the Q&A format helps AI extraction.',
      },
      tables: {
        ok: 'There are {count} data table(s), easy for AI to extract.',
        none:
          'No tables; for comparable data, a table is more citable than text.',
      },
      transcript: {
        na: 'No videos or embeds requiring a transcript.',
        ok: 'A transcript/captions are detected alongside the audiovisual content.',
        missing:
          'There is video/embed with no text transcript; that content is invisible to AI.',
      },
      semanticHtml: {
        divSoup: '"div-soup" structure ({divs} divs, 0 semantic elements).',
        good: 'Good semantic HTML ({count} semantic elements).',
        some:
          'Some semantic HTML ({count} elements), but divs dominate ({divs}).',
      },
      jsDependency: {
        fail:
          'The initial HTML has almost no text ({words} words) and depends on JavaScript: invisible to many AI crawlers.',
        warn:
          'Possible JavaScript dependency ({words} words in HTML, {scripts} scripts).',
        pass:
          'The main content is in the initial HTML ({words} words), readable without running JavaScript.',
      },
    },
    perf: {
      coreWebVitals:
        'Measuring Core Web Vitals (LCP, INP, CLS) requires a backend. Available in the Pro version.',
    },
  },

  // ── Localized value pills ──────────────────────────────────────────────────
  val: {
    metaRobotsDefault: 'index,follow (default)',
    headings: '{n} headings',
    botsAllowed: '{allowed}/{total} allowed',
    figures: '{n} figures',
    figuresPct: '{n} figures, {pct} %',
    expressions: '{n} expressions',
    questions: '{n} questions',
    media: '{n} media',
    words: '{n} words',
  },

  // ── Page-specific evidence labels (inline dropdown), keyed by dotted path ──
  evidence: {
    https: { protocol: 'Protocol' },
    httpStatus: { code: 'Status code' },
    htmlLang: { value: 'Declared language' },
    viewport: { content: 'Viewport content' },
    canonical: { url: 'Canonical URL' },
    metaRobots: { content: 'Meta robots' },
    robots: { url: 'robots.txt URL' },
    sitemap: { url: 'sitemap.xml URL' },
    urlClean: { url: 'URL path' },
    title: { text: 'Title text', length: 'Length (characters)' },
    metaDescription: { text: 'Description text', length: 'Length (characters)' },
    h1: { count: 'H1 count', text: 'First H1' },
    headings: { count: 'Headings', outline: 'Outline' },
    wordCount: { value: 'Words' },
    textHtmlRatio: { value: 'Text/HTML ratio' },
    imgAlt: { coverage: 'Images with alt', missingCount: 'Images without alt', samples: 'Examples' },
    openGraph: { present: 'Present tags', missing: 'Missing tags' },
    twitterCards: { card: 'Card type' },
    internalLinks: { count: 'Internal links', samples: 'Examples' },
    jsonld: { blocks: 'JSON-LD blocks' },
    schemaTypes: { list: 'Detected types' },
    orgSameas: { profiles: 'Linked profiles' },
    authorProfile: { name: 'Author' },
    syntaxValid: { invalid: 'Blocks with errors' },
    bots: { blocked: 'Blocked', allowed: 'Allowed', trainingBlocked: 'Blocked training bots' },
    llms: { url: 'llms.txt URL', firstHeading: 'First heading' },
    bluf: { opening: 'Opening' },
    dataDensity: { figures: 'Figures', percents: 'Percentages' },
    promo: { hits: 'Promotional phrases' },
    qa: { count: 'Question headings', samples: 'Examples' },
    tables: { count: 'Tables' },
    transcript: { mediaCount: 'Media items' },
    semantic: { semanticCount: 'Semantic elements', divCount: 'Divs' },
    js: { words: 'Words in HTML', scripts: 'External scripts' },
  },

  // ── Static per-check copy, keyed by check id ───────────────────────────────
  check: {
    'tech.https': {
      label: 'HTTPS',
      why: 'HTTPS encrypts the connection and is a trust and ranking factor. Browsers flag HTTP pages as "not secure".',
      howToFix:
        "Install a TLS certificate (Let's Encrypt is free) and force a 301 redirect from HTTP to HTTPS across the whole site.",
    },
    'tech.http-status': {
      label: 'HTTP 200 status',
      why: 'A 4xx/5xx prevents indexing and ruins the experience. The page must respond 200 OK.',
      howToFix:
        'Check the server or CDN: fix the resource (404), the permissions (403) or the application error (5xx) until it returns 200.',
    },
    'tech.html-lang': {
      label: '<html lang>',
      why: 'The lang attribute helps search engines, screen readers and AI engines understand the content language.',
      howToFix: 'Add the language to the root tag, e.g. <html lang="en">.',
    },
    'tech.viewport': {
      label: 'Meta viewport',
      why: 'The viewport meta tag is required for responsive rendering on mobile; without it the page renders zoomed-out.',
      howToFix:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head>.',
    },
    'tech.canonical': {
      label: 'Canonical URL',
      why: 'The canonical tag consolidates duplicate or parameterized URLs into one, concentrating ranking signals.',
      howToFix:
        'Add <link rel="canonical" href="https://…"> with the absolute preferred URL in the <head>.',
    },
    'tech.meta-robots': {
      label: 'Meta robots',
      why: 'A noindex/nofollow in meta robots removes the page from search results and stops link following.',
      howToFix:
        'Remove noindex/nofollow from the meta robots tag if you want the page indexed, or leave it only on private pages.',
    },
    'tech.robots-txt': {
      label: 'robots.txt',
      why: 'robots.txt guides crawlers on what they can access. A missing or broken one can cause crawl problems.',
      howToFix:
        'Publish a valid /robots.txt with User-agent and Allow/Disallow rules, and reference your sitemap.',
    },
    'tech.sitemap': {
      label: 'sitemap.xml',
      why: 'The sitemap lists your URLs so engines discover and index them faster, especially on large sites.',
      howToFix:
        'Generate a valid /sitemap.xml, keep it updated and reference it in robots.txt with "Sitemap:".',
    },
    'tech.url-clean': {
      label: 'Clean URL',
      why: 'Short, readable URLs without tracking parameters or excessive depth are friendlier for users and engines.',
      howToFix:
        'Use lowercase, descriptive slugs, avoid tracking parameters in indexable URLs and keep the depth shallow.',
    },
    'onpage.title': {
      label: 'Title tag',
      why: 'The <title> is the main signal in results and AI answers. Its length and uniqueness affect CTR and ranking.',
      howToFix:
        'Write a unique, descriptive 50-60 character title with the main keyword near the start.',
    },
    'onpage.meta-description': {
      label: 'Meta description',
      why: 'The meta description is the snippet in results. It does not rank directly but strongly influences CTR.',
      howToFix:
        'Write a compelling 120-160 character description that summarizes the page and invites the click.',
    },
    'onpage.h1-single': {
      label: 'Single H1',
      why: 'The H1 is the main heading of the content. Exactly one keeps the hierarchy clear for users and crawlers.',
      howToFix:
        'Leave a single <h1> describing the page and use <h2>-<h6> for the rest of the structure.',
    },
    'onpage.heading-hierarchy': {
      label: 'Heading hierarchy',
      why: 'A hierarchy without skipped levels (h1→h2→h3) helps accessibility and content understanding by AI.',
      howToFix:
        'Do not skip levels: after an h2 use h3, not h4. Structure headings by their meaning, not their size.',
    },
    'onpage.word-count': {
      label: 'Content depth',
      why: 'Enough content lets you cover the topic and gives engines and AI material to understand and cite.',
      howToFix:
        'Expand the content to thoroughly cover the topic (300+ words as a guideline) without padding.',
    },
    'onpage.text-html-ratio': {
      label: 'Text/HTML ratio',
      why: 'A very low ratio of visible text to markup can signal thin content or excessive heavy code.',
      howToFix:
        'Reduce unnecessary markup and inline code, and prioritize real visible content.',
    },
    'onpage.img-alt': {
      label: 'Images with alt',
      why: 'The alt text describes images for screen readers and engines, and helps image search.',
      howToFix:
        'Add a descriptive alt to every meaningful image; use empty alt="" only for decorative ones.',
    },
    'onpage.open-graph': {
      label: 'Open Graph',
      why: 'Open Graph tags control how the link looks when shared on social media (title, description, image).',
      howToFix:
        'Add og:title, og:description and og:image with an image of at least 1200×630 px.',
    },
    'onpage.twitter-cards': {
      label: 'Twitter Cards',
      why: 'Twitter Cards define the rich preview when sharing on X/Twitter, improving visibility.',
      howToFix:
        'Add twitter:card (e.g. summary_large_image); it falls back to Open Graph for the rest.',
    },
    'onpage.internal-links': {
      label: 'Internal links',
      why: 'Internal links distribute authority and help users and crawlers discover related content.',
      howToFix:
        'Add contextual links to other relevant pages with descriptive anchor text.',
    },
    'schema.jsonld-present': {
      label: 'JSON-LD present',
      why: 'JSON-LD structured data lets engines and AI understand entities and enables rich results.',
      howToFix:
        'Add a <script type="application/ld+json"> block with the schema.org type that fits the page.',
    },
    'schema.types-detected': {
      label: 'Schema types',
      why: 'The declared @type (Article, Product, FAQPage…) tells engines what kind of content it is.',
      howToFix:
        'Use the schema.org type that matches the page and complete its required properties.',
    },
    'schema.org-sameas': {
      label: 'Organization + sameAs',
      why: 'sameAs links your Organization to its official profiles, reinforcing the entity for engines and AI.',
      howToFix:
        'Add sameAs with the URLs of your official social and reference profiles in the Organization schema.',
    },
    'schema.author-profile': {
      label: 'Author (E-E-A-T)',
      why: 'Declaring the author on editorial content reinforces experience and authority (E-E-A-T).',
      howToFix:
        'Add author (Person) with name and, ideally, a sameAs to the author profile.',
    },
    'schema.syntax-valid': {
      label: 'Valid JSON-LD syntax',
      why: 'A JSON-LD block with syntax errors is ignored entirely, wasting its potential.',
      howToFix:
        'Validate the JSON-LD with a linter or the Rich Results Test and fix any parsing errors.',
    },
    'geo.ai-search-bots': {
      label: 'AI search bots',
      why: 'AI search bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) power live retrieval and citations. Blocking them means your site cannot be cited in AI answers.',
      howToFix:
        'In robots.txt, do not block the AI search user-agents you want to be cited by; allow at least the root path.',
    },
    'geo.ai-training-bots': {
      label: 'AI training bots',
      why: 'Training bots (GPTBot, ClaudeBot, Google-Extended…) use content to train models. Blocking them is legitimate and does not affect citations.',
      howToFix:
        'Decide deliberately: block them if you do not want to feed training, but know it does not improve or worsen citations.',
    },
    'geo.llms-txt': {
      label: 'llms.txt',
      why: 'llms.txt is an emerging convention to guide AI models to your key content in Markdown.',
      howToFix:
        'Publish a /llms.txt with headings and Markdown links to your most important pages.',
    },
    'geo.bluf': {
      label: 'Direct answer (BLUF)',
      why: 'A direct answer up front (Bottom Line Up Front) makes it easier for AI to extract and cite your content.',
      howToFix:
        'Open with a substantial paragraph that answers the page intent directly in the first ~150 words.',
    },
    'geo.data-density': {
      label: 'Data density',
      why: 'Concrete data (figures, percentages, dates) makes content more citable and verifiable for AI.',
      howToFix:
        'Add verifiable figures, statistics and concrete data to back up your statements.',
    },
    'geo.promotional-tone': {
      label: 'Objective tone',
      why: 'Excessively promotional language ("the best", "unbeatable") reduces credibility for AI engines.',
      howToFix:
        'Replace marketing claims with verifiable facts and a neutral, objective tone.',
    },
    'geo.qa-format': {
      label: 'Q&A format',
      why: 'Questions as headings match how people ask AI and make answer extraction easier.',
      howToFix:
        'Turn key sections into questions (h2/h3) followed by a direct answer.',
    },
    'geo.tables': {
      label: 'Data tables',
      why: 'Tables structure comparable data so AI can extract and cite it more reliably than prose.',
      howToFix:
        'Present comparative or numeric data in <table> with clear headers instead of paragraphs.',
    },
    'geo.transcript': {
      label: 'Video transcript',
      why: 'AI cannot watch video; without a text transcript that content is invisible to AI engines.',
      howToFix:
        'Add a text transcript or <track> captions next to each video or embed.',
    },
    'geo.semantic-html': {
      label: 'Semantic HTML',
      why: 'Semantic elements (article, section, main…) help AI understand the structure and meaning of the content.',
      howToFix:
        'Replace generic divs with semantic tags (article, main, section, header, footer).',
    },
    'geo.js-dependency': {
      label: 'JavaScript dependency',
      why: 'If the main content only appears after running JavaScript, many AI crawlers will not see it.',
      howToFix:
        'Serve the main content in the initial HTML (SSR/SSG) so it is readable without executing JS.',
    },
    'perf.core-web-vitals': {
      label: 'Core Web Vitals',
      why: 'LCP, INP and CLS measure real loading, interactivity and visual stability — Google ranking factors.',
      howToFix:
        'Optimize images, reduce blocking JavaScript and reserve space for elements to avoid layout shifts.',
    },
  },
};

export type Dictionary = typeof en;
export default en;

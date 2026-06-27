// Italian dictionary. Mirrors the shape of the English base dictionary.

import type { Dictionary } from './en';

const it: Dictionary = {
  nav: {
    getHelp: 'Aiuto',
    language: 'Lingua',
  },

  landing: {
    titleBefore: 'La tua pagina è pronta per la ',
    titleSeo: 'SEO',
    titleMid: ' e per l\'',
    titleAi: 'IA',
    titleAfter: '?',
    subtitle:
      'Analizza qualsiasi URL e scopri quanto è ottimizzata per la SEO classica e per GEO — essere citata nelle risposte di ChatGPT, Claude e Perplexity.',
  },

  url: {
    placeholder: 'inserisci-un-url.com',
    analyze: 'Analizza',
    analyzing: 'Analisi in corso…',
    errorEmpty: 'Inserisci un URL da analizzare.',
    errorInvalid: "L'URL non sembra valido.",
    ariaLabel: 'URL da analizzare',
  },

  loading: {
    title: 'Analisi in corso',
  },

  steps: {
    'fetch-html': "Lettura dell'HTML della pagina",
    'fetch-robots': 'Analisi di robots.txt',
    'fetch-sitemap': 'Verifica di sitemap.xml',
    'fetch-llms': 'Ricerca di llms.txt',
    'analyze-technical': 'Valutazione della SEO tecnica',
    'analyze-onpage': 'Valutazione dei contenuti on-page',
    'analyze-schema': 'Valutazione dei dati strutturati',
    'analyze-geo': 'Valutazione della GEO (motori di IA)',
    scoring: 'Calcolo del punteggio',
  },

  status: {
    pass: 'Corretto',
    warn: 'Migliorabile',
    fail: 'Errore',
    info: 'Info',
    na: 'Non applicabile',
  },

  category: {
    technical: 'SEO tecnica',
    onpage: 'On-page',
    schema: 'Dati strutturati',
    geo: 'GEO',
    performance: 'Prestazioni',
  },

  score: {
    critical: 'Critico',
    improvable: 'Migliorabile',
    good: 'Buono',
    excellent: 'Eccellente',
  },

  dashboard: {
    heroAria: 'Punteggio globale',
    heroSub:
      'Punteggio globale che combina SEO classica e GEO (ottimizzazione per i motori di IA).',
    analyzedAt: 'Analizzato il {date} · via {proxy}',
    direct: 'diretto',
    reanalyze: 'Rianalizza',
    newUrl: 'Analizza un altro URL',
    warningsTitle: 'Avvisi:',
    filterShow: 'Mostra:',
    filterAll: 'Tutto',
    filterFail: 'Solo errori',
    filterWarn: 'Solo migliorabili',
    filterAria: 'Filtra i controlli',
    categoryEmpty: 'Nessun elemento per questo filtro in questa categoria.',
    kpis: {
      title: 'Panoramica',
      pass: 'Superati',
      warn: 'Migliorabili',
      fail: 'Falliti',
      checks: '{n} controlli',
    },
    distribution: {
      title: 'Distribuzione degli stati',
    },
    ranking: {
      title: 'Categorie per impatto',
      subtitle: 'Prima le maggiori opportunità',
      impact: 'Impatto {n}',
    },
    priority: {
      title: 'Raccomandazioni prioritarie',
      subtitle: 'Ordinate per peso × gravità',
      empty: 'Nessun controllo fallito o migliorabile — ottimo lavoro.',
      inCategory: '{category}',
    },
  },

  tour: {
    toggle: 'Aiuto guidato',
    close: 'Chiudi',
    title: 'Aiuto guidato',
    hint: "Tocca un controllo qualsiasi per scoprire che cos'è, come dovrebbe funzionare e perché è importante.",
  },

  categoryCard: {
    lockedAria: '{label} (bloccato)',
    lockedBody:
      'La misurazione dei Core Web Vitals (LCP, INP, CLS) richiede un backend con dati di campo e non può essere eseguita in modo sicuro nel browser.',
    proCta: 'Disponibile nella versione Pro',
    scoreAria: 'Sotto-punteggio di {label}',
  },

  detail: {
    what: "Che cos'è",
    why: 'Perché è importante',
    howToFix: 'Come risolverlo',
    moreInfo: 'Maggiori informazioni ↗',
  },

  errors: {
    unknown: "Errore sconosciuto durante l'analisi.",
    fetchFailed:
      "Impossibile recuperare la pagina. Controlla l'URL o riprova. ({detail})",
    noDetails: 'nessun dettaglio',
  },

  warnings: {
    robots: 'Impossibile recuperare robots.txt.',
    sitemap: 'Impossibile recuperare sitemap.xml.',
  },

  msg: {
    tech: {
      https: {
        pass: 'La pagina viene servita tramite HTTPS.',
        fail: 'La pagina non usa HTTPS; la connessione non è cifrata.',
      },
      httpStatus: {
        proxy:
          'Il codice HTTP non è osservabile tramite il proxy; il contenuto è stato recuperato, quindi la pagina risponde.',
        ok: 'La pagina risponde {status} OK.',
        other: 'La pagina risponde {status}.',
      },
      htmlLang: {
        pass: 'Lingua dichiarata: "{lang}".',
        fail: "Manca l'attributo lang nel tag <html>.",
      },
      viewport: {
        pass: 'Meta viewport presente; la pagina è pronta per il responsive.',
        fail: 'Manca il meta viewport; la pagina non si adatterà ai dispositivi mobili.',
      },
      canonical: {
        missing: 'Nessun tag canonical trovato.',
        ok: 'Canonical presente e ben formato.',
        notAbsolute: 'Canonical presente ma non è un URL assoluto valido.',
      },
      metaRobots: {
        blocks: "Il meta robots blocca l'indicizzazione/il following (\"{value}\").",
        ok: "Il meta robots non blocca l'indicizzazione.",
      },
      robotsTxt: {
        missing: 'Impossibile recuperare /robots.txt o non esiste.',
        valid: 'robots.txt esiste e contiene direttive valide.',
        invalid:
          'robots.txt esiste ma non contiene direttive User-agent riconoscibili.',
      },
      sitemap: {
        missingRef:
          'robots.txt fa riferimento a una sitemap, ma /sitemap.xml non ha risposto.',
        missing: 'Nessun /sitemap.xml trovato né riferimento in robots.txt.',
        invalid: 'sitemap.xml risponde ma non sembra un XML di sitemap valido.',
        validRef: 'sitemap.xml valido e referenziato da robots.txt.',
        validNoRef: 'sitemap.xml valido, ma non referenziato in robots.txt.',
      },
      urlClean: {
        dirty: 'URL migliorabile{reasons}.',
        clean: 'URL pulito e leggibile.',
        tracking: ' (parametri di tracking)',
        depth: ' (percorso profondo)',
        upper: ' (maiuscole)',
      },
    },
    onpage: {
      title: {
        missing: "Non c'è alcun tag <title>.",
        generic: 'Il title è generico ("{title}").',
        optimal: 'Title ottimale ({len} caratteri).',
        acceptable:
          "Title accettabile ma fuori dall'intervallo ideale di 50-60 ({len} caratteri).",
        short: 'Title troppo corto ({len} caratteri).',
        long: 'Title troppo lungo ({len} caratteri); verrà troncato nei risultati.',
      },
      metaDescription: {
        missing: 'Manca la meta description.',
        optimal: 'Meta description ottimale ({len} caratteri).',
        short: "Meta description corta ({len} caratteri); l'ideale è 120-160.",
        long: 'Meta description lunga ({len} caratteri); verrà troncata.',
      },
      h1Single: {
        one: "C'è esattamente un <h1>.",
        none: "Non c'è alcun <h1>.",
        many: 'Ci sono {count} tag <h1>; dovrebbe essercene uno solo.',
      },
      headingHierarchy: {
        none: 'Non ci sono intestazioni che strutturino il contenuto.',
        skipped: 'La gerarchia delle intestazioni salta dei livelli (es. da h2 a h4).',
        ok: 'La gerarchia delle intestazioni è coerente.',
      },
      wordCount: {
        ok: 'Contenuto con sufficiente profondità ({words} parole).',
        short: 'Contenuto scarno ({words} parole); ampliarlo per aggiungere più valore.',
      },
      textHtmlRatio: {
        ok: 'Buon rapporto testo/HTML ({ratio}).',
        low: 'Rapporto testo/HTML basso ({ratio}); troppo markup rispetto al testo.',
      },
      imgAlt: {
        none: 'Non ci sono immagini nella pagina.',
        all: "Tutte le immagini hanno l'attributo alt.",
        partial: "Solo {withAlt} di {total} immagini hanno l'alt.",
      },
      openGraph: {
        complete: 'Open Graph completo (title, description, image).',
        none: 'Nessun tag Open Graph.',
        partial: 'Open Graph incompleto ({count}/3): manca {missing}.',
      },
      twitterCards: {
        present: 'Twitter Card dichiarata.',
        missing:
          'Nessuna Twitter Card; migliorano la presentazione quando si condivide su X/Twitter.',
      },
      internalLinks: {
        ok: '{count} link interni rilevati.',
        none:
          "Nessun link interno; ostacola la scoperta e la distribuzione dell'autorità.",
        few: 'Solo {count} link interno/i; aggiungine altri per collegare i tuoi contenuti.',
      },
    },
    schema: {
      jsonldPresent: {
        present: 'Trovati {blocks} blocco/blocchi JSON-LD.',
        none: 'Nessun dato strutturato JSON-LD.',
      },
      typesDetected: {
        na: 'Nessun JSON-LD da analizzare.',
        detected: 'Tipi rilevati: {types}.',
        noType: "C'è del JSON-LD ma nessun @type riconoscibile.",
      },
      orgSameas: {
        noOrg: 'Nessuno schema Organization nella pagina.',
        has: 'Organization include sameAs con i profili collegati.',
        missing:
          "Organization senza sameAs; aggiungi i profili ufficiali per rafforzare l'entità.",
      },
      authorProfile: {
        na: 'Non è contenuto editoriale (Article/ProfilePage); non applicabile.',
        has: 'Il contenuto editoriale dichiara un autore.',
        missing:
          "Contenuto editoriale senza autore dichiarato; aggiungi author (Person) per l'E-E-A-T.",
      },
      syntaxValid: {
        na: 'Nessun JSON-LD da validare.',
        valid: 'Tutti i blocchi JSON-LD hanno una sintassi valida.',
        invalid:
          '{invalid} di {blocks} blocco/blocchi JSON-LD presentano errori di sintassi e verranno ignorati.',
      },
    },
    geo: {
      aiSearchBots: {
        noRobots:
          'Nessun robots.txt: per impostazione predefinita tutti i bot di ricerca IA possono scansionare e citare la pagina.',
        allBlocked:
          "Tutti i bot di ricerca IA sono bloccati: i tuoi contenuti non potranno essere citati dall'IA. ({summary})",
        someBlocked:
          '{blocked} di {total} bot di ricerca IA bloccati. ({summary})',
        allowed: 'Tutti i bot di ricerca IA possono scansionare la pagina. ({summary})',
      },
      aiTrainingBots: {
        info:
          'Bot di addestramento: {blocked} bloccati. È una scelta legittima e non incide sulle citazioni. ({summary})',
        noRobots: 'Nessun robots.txt: tutti i bot di addestramento possono usare il contenuto.',
      },
      llmsTxt: {
        missing: 'Nessun /llms.txt trovato.',
        structured:
          'llms.txt presente con struttura (intestazioni/link Markdown).',
        unstructured:
          'llms.txt presente ma senza una struttura Markdown riconoscibile.',
      },
      bluf: {
        none:
          "Non c'è un paragrafo iniziale sostanziale che funga da risposta diretta.",
        ok: "C'è un paragrafo con risposta diretta entro le prime ~150 parole.",
        notLeading:
          "C'è contenuto sostanziale, ma la risposta diretta non compare all'inizio.",
      },
      dataDensity: {
        ok: 'Buona densità di dati concreti (cifre, percentuali); contenuto citabile.',
        few: 'Pochi dati concreti; aggiungi più cifre verificabili.',
        none:
          "Quasi nessun dato concreto; il contenuto è difficile da citare per l'IA.",
      },
      promotionalTone: {
        neutral: "Tono neutro e oggettivo, adatto a essere citato dall'IA.",
        promo:
          "Rilevato linguaggio promozionale ({hits}) che riduce la credibilità presso l'IA.",
      },
      qaFormat: {
        ok: 'Il contenuto usa le domande come intestazioni (formato Q&A).',
        few:
          "Poche o nessuna domanda come intestazione; il formato Q&A favorisce l'estrazione da parte dell'IA.",
      },
      tables: {
        ok: "Ci sono {count} tabella/e di dati, facili da estrarre per l'IA.",
        none:
          'Nessuna tabella; per dati comparabili, una tabella è più citabile del testo.',
      },
      transcript: {
        na: 'Nessun video o embed che richieda una trascrizione.',
        ok: 'Viene rilevata una trascrizione/sottotitoli insieme al contenuto audiovisivo.',
        missing:
          "C'è un video/embed senza trascrizione testuale; quel contenuto è invisibile per l'IA.",
      },
      semanticHtml: {
        divSoup: 'Struttura tipo "div-soup" ({divs} div, 0 elementi semantici).',
        good: 'Buon HTML semantico ({count} elementi semantici).',
        some:
          "Un po' di HTML semantico ({count} elementi), ma predominano i div ({divs}).",
      },
      jsDependency: {
        fail:
          "L'HTML iniziale non ha quasi testo ({words} parole) e dipende da JavaScript: invisibile per molti crawler IA.",
        warn:
          "Possibile dipendenza da JavaScript ({words} parole nell'HTML, {scripts} script).",
        pass:
          "Il contenuto principale è nell'HTML iniziale ({words} parole), leggibile senza eseguire JavaScript.",
      },
    },
    perf: {
      coreWebVitals:
        'La misurazione dei Core Web Vitals (LCP, INP, CLS) richiede un backend. Disponibile nella versione Pro.',
    },
  },

  val: {
    metaRobotsDefault: 'index,follow (predefinito)',
    headings: '{n} intestazioni',
    botsAllowed: '{allowed}/{total} consentiti',
    figures: '{n} cifre',
    figuresPct: '{n} cifre, {pct} %',
    expressions: '{n} espressioni',
    questions: '{n} domande',
    media: '{n} contenuti multimediali',
    words: '{n} parole',
  },

  check: {
    'tech.https': {
      label: 'HTTPS',
      why: 'HTTPS cifra la connessione ed è un fattore di fiducia e di ranking. I browser segnalano come "non sicure" le pagine HTTP.',
      howToFix:
        "Installa un certificato TLS (Let's Encrypt è gratuito) e forza un reindirizzamento 301 da HTTP a HTTPS su tutto il sito.",
    },
    'tech.http-status': {
      label: 'Codice HTTP 200',
      why: "Un 4xx/5xx impedisce l'indicizzazione e rovina l'esperienza. La pagina deve rispondere 200 OK.",
      howToFix:
        "Controlla il server o la CDN: correggi la risorsa (404), i permessi (403) o l'errore dell'applicazione (5xx) finché non restituisce 200.",
    },
    'tech.html-lang': {
      label: '<html lang>',
      why: "L'attributo lang aiuta i motori di ricerca, gli screen reader e i motori di IA a capire la lingua del contenuto.",
      howToFix: 'Aggiungi la lingua al tag radice, es. <html lang="it">.',
    },
    'tech.viewport': {
      label: 'Meta viewport',
      why: 'Il meta viewport è necessario per il rendering responsive su mobile; senza di esso la pagina viene mostrata rimpicciolita.',
      howToFix:
        "Aggiungi <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> nell'<head>.",
    },
    'tech.canonical': {
      label: 'URL canonico',
      why: 'Il tag canonical consolida in uno solo gli URL duplicati o parametrizzati, concentrando i segnali di ranking.',
      howToFix:
        "Aggiungi <link rel=\"canonical\" href=\"https://…\"> con l'URL assoluto preferito nell'<head>.",
    },
    'tech.meta-robots': {
      label: 'Meta robots',
      why: 'Un noindex/nofollow nel meta robots rimuove la pagina dai risultati di ricerca e interrompe il following dei link.',
      howToFix:
        'Rimuovi noindex/nofollow dal tag meta robots se vuoi indicizzare la pagina, oppure lascialo solo sulle pagine private.',
    },
    'tech.robots-txt': {
      label: 'robots.txt',
      why: 'robots.txt guida i crawler su cosa possono accedere. Uno assente o danneggiato può causare problemi di scansione.',
      howToFix:
        'Pubblica un /robots.txt valido con regole User-agent e Allow/Disallow, e referenzia la tua sitemap.',
    },
    'tech.sitemap': {
      label: 'sitemap.xml',
      why: 'La sitemap elenca i tuoi URL così che i motori li scoprano e indicizzino più rapidamente, soprattutto sui siti grandi.',
      howToFix:
        'Genera un /sitemap.xml valido, mantienilo aggiornato e referenzialo in robots.txt con "Sitemap:".',
    },
    'tech.url-clean': {
      label: 'URL pulito',
      why: 'Gli URL brevi e leggibili, senza parametri di tracking né profondità eccessiva, sono più amichevoli per utenti e motori.',
      howToFix:
        'Usa slug descrittivi in minuscolo, evita i parametri di tracking negli URL indicizzabili e mantieni la profondità ridotta.',
    },
    'onpage.title': {
      label: 'Tag title',
      why: "Il <title> è il segnale principale nei risultati e nelle risposte dell'IA. La sua lunghezza e unicità influenzano CTR e ranking.",
      howToFix:
        "Scrivi un title unico e descrittivo di 50-60 caratteri con la parola chiave principale vicino all'inizio.",
    },
    'onpage.meta-description': {
      label: 'Meta description',
      why: 'La meta description è lo snippet nei risultati. Non posiziona direttamente ma influenza molto il CTR.',
      howToFix:
        'Scrivi una descrizione accattivante di 120-160 caratteri che riassuma la pagina e inviti al clic.',
    },
    'onpage.h1-single': {
      label: 'H1 unico',
      why: "L'H1 è l'intestazione principale del contenuto. Esattamente uno mantiene chiara la gerarchia per utenti e crawler.",
      howToFix:
        'Lascia un unico <h1> che descriva la pagina e usa <h2>-<h6> per il resto della struttura.',
    },
    'onpage.heading-hierarchy': {
      label: 'Gerarchia delle intestazioni',
      why: "Una gerarchia senza salti di livello (h1→h2→h3) aiuta l'accessibilità e la comprensione del contenuto da parte dell'IA.",
      howToFix:
        'Non saltare i livelli: dopo un h2 usa h3, non h4. Struttura le intestazioni per il loro significato, non per la loro dimensione.',
    },
    'onpage.word-count': {
      label: 'Profondità del contenuto',
      why: "Contenuto sufficiente ti permette di coprire l'argomento e dà a motori e IA materiale per comprenderlo e citarlo.",
      howToFix:
        "Amplia il contenuto per coprire l'argomento a fondo (300+ parole come riferimento) senza riempitivi.",
    },
    'onpage.text-html-ratio': {
      label: 'Rapporto testo/HTML',
      why: 'Un rapporto molto basso di testo visibile rispetto al markup può indicare contenuto scarno o eccesso di codice pesante.',
      howToFix:
        'Riduci il markup e il codice inline non necessario, e dai priorità al contenuto visibile reale.',
    },
    'onpage.img-alt': {
      label: 'Immagini con alt',
      why: 'Il testo alt descrive le immagini per gli screen reader e i motori, e aiuta la ricerca per immagini.',
      howToFix:
        'Aggiungi un alt descrittivo a ogni immagine significativa; usa alt="" vuoto solo per quelle decorative.',
    },
    'onpage.open-graph': {
      label: 'Open Graph',
      why: "I tag Open Graph controllano l'aspetto del link quando viene condiviso sui social (titolo, descrizione, immagine).",
      howToFix:
        "Aggiungi og:title, og:description e og:image con un'immagine di almeno 1200×630 px.",
    },
    'onpage.twitter-cards': {
      label: 'Twitter Cards',
      why: "Le Twitter Card definiscono l'anteprima arricchita quando si condivide su X/Twitter, migliorando la visibilità.",
      howToFix:
        'Aggiungi twitter:card (es. summary_large_image); per il resto ricade su Open Graph.',
    },
    'onpage.internal-links': {
      label: 'Link interni',
      why: 'I link interni distribuiscono autorità e aiutano utenti e crawler a scoprire contenuti correlati.',
      howToFix:
        'Aggiungi link contestuali ad altre pagine pertinenti con un testo ancora descrittivo.',
    },
    'schema.jsonld-present': {
      label: 'JSON-LD presente',
      why: 'I dati strutturati JSON-LD permettono a motori e IA di comprendere le entità e abilitano i risultati arricchiti.',
      howToFix:
        'Aggiungi un blocco <script type="application/ld+json"> con il tipo di schema.org adatto alla pagina.',
    },
    'schema.types-detected': {
      label: 'Tipi di schema',
      why: 'Il @type dichiarato (Article, Product, FAQPage…) indica ai motori che tipo di contenuto è.',
      howToFix:
        'Usa il tipo di schema.org corrispondente alla pagina e completa le sue proprietà obbligatorie.',
    },
    'schema.org-sameas': {
      label: 'Organization + sameAs',
      why: "sameAs collega la tua Organization ai suoi profili ufficiali, rafforzando l'entità presso motori e IA.",
      howToFix:
        'Aggiungi sameAs con gli URL dei tuoi profili social e di riferimento ufficiali nello schema Organization.',
    },
    'schema.author-profile': {
      label: 'Autore (E-E-A-T)',
      why: "Dichiarare l'autore nei contenuti editoriali rafforza l'esperienza e l'autorevolezza (E-E-A-T).",
      howToFix:
        "Aggiungi author (Person) con il nome e, idealmente, un sameAs al profilo dell'autore.",
    },
    'schema.syntax-valid': {
      label: 'Sintassi JSON-LD valida',
      why: 'Un blocco JSON-LD con errori di sintassi viene ignorato completamente, sprecando il suo potenziale.',
      howToFix:
        'Valida il JSON-LD con un linter o con il Rich Results Test e correggi eventuali errori di parsing.',
    },
    'geo.ai-search-bots': {
      label: 'Bot di ricerca IA',
      why: "I bot di ricerca IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) alimentano il recupero in tempo reale e le citazioni. Bloccarli significa che il tuo sito non potrà essere citato nelle risposte dell'IA.",
      howToFix:
        'In robots.txt, non bloccare gli user-agent di ricerca IA da cui vuoi essere citato; consenti almeno il percorso radice.',
    },
    'geo.ai-training-bots': {
      label: 'Bot di addestramento IA',
      why: 'I bot di addestramento (GPTBot, ClaudeBot, Google-Extended…) usano il contenuto per addestrare i modelli. Bloccarli è legittimo e non incide sulle citazioni.',
      howToFix:
        "Decidi in modo consapevole: bloccali se non vuoi alimentare l'addestramento, ma sappi che non migliora né peggiora le citazioni.",
    },
    'geo.llms-txt': {
      label: 'llms.txt',
      why: 'llms.txt è una convenzione emergente per guidare i modelli di IA verso i tuoi contenuti chiave in Markdown.',
      howToFix:
        'Pubblica un /llms.txt con intestazioni e link Markdown alle tue pagine più importanti.',
    },
    'geo.bluf': {
      label: 'Risposta diretta (BLUF)',
      why: "Una risposta diretta all'inizio (Bottom Line Up Front) facilita all'IA l'estrazione e la citazione del tuo contenuto.",
      howToFix:
        "Apri con un paragrafo sostanziale che risponda direttamente all'intento della pagina nelle prime ~150 parole.",
    },
    'geo.data-density': {
      label: 'Densità di dati',
      why: "I dati concreti (cifre, percentuali, date) rendono il contenuto più citabile e verificabile per l'IA.",
      howToFix:
        'Aggiungi cifre verificabili, statistiche e dati concreti a supporto delle tue affermazioni.',
    },
    'geo.promotional-tone': {
      label: 'Tono oggettivo',
      why: 'Un linguaggio eccessivamente promozionale ("il migliore", "imbattibile") riduce la credibilità presso i motori di IA.',
      howToFix:
        'Sostituisci le affermazioni di marketing con fatti verificabili e un tono neutro e oggettivo.',
    },
    'geo.qa-format': {
      label: 'Formato Q&A',
      why: "Le domande come intestazioni rispecchiano il modo in cui le persone interrogano l'IA e facilitano l'estrazione delle risposte.",
      howToFix:
        'Trasforma le sezioni chiave in domande (h2/h3) seguite da una risposta diretta.',
    },
    'geo.tables': {
      label: 'Tabelle di dati',
      why: "Le tabelle strutturano dati comparabili così che l'IA possa estrarli e citarli con più affidabilità della prosa.",
      howToFix:
        'Presenta i dati comparativi o numerici in <table> con intestazioni chiare invece che in paragrafi.',
    },
    'geo.transcript': {
      label: 'Trascrizione video',
      why: "L'IA non può guardare i video; senza una trascrizione testuale quel contenuto è invisibile per i motori di IA.",
      howToFix:
        'Aggiungi una trascrizione testuale o sottotitoli <track> accanto a ogni video o embed.',
    },
    'geo.semantic-html': {
      label: 'HTML semantico',
      why: "Gli elementi semantici (article, section, main…) aiutano l'IA a comprendere la struttura e il significato del contenuto.",
      howToFix:
        'Sostituisci i div generici con tag semantici (article, main, section, header, footer).',
    },
    'geo.js-dependency': {
      label: 'Dipendenza da JavaScript',
      why: "Se il contenuto principale compare solo dopo l'esecuzione di JavaScript, molti crawler IA non lo vedranno.",
      howToFix:
        "Servi il contenuto principale nell'HTML iniziale (SSR/SSG) così che sia leggibile senza eseguire JS.",
    },
    'perf.core-web-vitals': {
      label: 'Core Web Vitals',
      why: 'LCP, INP e CLS misurano caricamento, interattività e stabilità visiva reali — fattori di ranking di Google.',
      howToFix:
        'Ottimizza le immagini, riduci il JavaScript bloccante e riserva spazio agli elementi per evitare spostamenti di layout.',
    },
  },
};

export default it;

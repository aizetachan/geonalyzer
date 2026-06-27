// German dictionary. Mirrors the shape of the English base dictionary.

import type { Dictionary } from './en';

const de: Dictionary = {
  nav: {
    getHelp: 'Hilfe',
    language: 'Sprache',
  },

  landing: {
    titleBefore: 'Ist deine Seite bereit für ',
    titleSeo: 'SEO',
    titleMid: ' und ',
    titleAi: 'KI',
    titleAfter: '?',
    subtitle:
      'Analysiere eine beliebige URL und finde heraus, wie gut sie für klassisches SEO und für GEO optimiert ist — also dafür, in Antworten von ChatGPT, Claude und Perplexity zitiert zu werden.',
  },

  url: {
    placeholder: 'eine-url-eingeben.com',
    analyze: 'Analysieren',
    analyzing: 'Analysiere…',
    errorEmpty: 'Gib eine URL zum Analysieren ein.',
    errorInvalid: 'Diese URL sieht nicht gültig aus.',
    ariaLabel: 'Zu analysierende URL',
  },

  loading: {
    title: 'Analysiere',
  },

  steps: {
    'fetch-html': 'Lese das HTML der Seite',
    'fetch-robots': 'Verarbeite robots.txt',
    'fetch-sitemap': 'Prüfe sitemap.xml',
    'fetch-llms': 'Suche nach llms.txt',
    'analyze-technical': 'Bewerte technisches SEO',
    'analyze-onpage': 'Bewerte On-Page-Inhalte',
    'analyze-schema': 'Bewerte strukturierte Daten',
    'analyze-geo': 'Bewerte GEO (KI-Engines)',
    scoring: 'Berechne Punktzahl',
  },

  status: {
    pass: 'Bestanden',
    warn: 'Verbesserbar',
    fail: 'Fehlgeschlagen',
    info: 'Info',
    na: 'k. A.',
  },

  category: {
    technical: 'Technisches SEO',
    onpage: 'On-Page',
    schema: 'Strukturierte Daten',
    geo: 'GEO',
    performance: 'Performance',
  },

  score: {
    critical: 'Kritisch',
    improvable: 'Verbesserungsbedarf',
    good: 'Gut',
    excellent: 'Hervorragend',
  },

  dashboard: {
    heroAria: 'Gesamtpunktzahl',
    heroSub:
      'Gesamtpunktzahl, die klassisches SEO und GEO (Optimierung für KI-Engines) kombiniert.',
    analyzedAt: 'Analysiert am {date} · via {proxy}',
    direct: 'direkt',
    reanalyze: 'Erneut analysieren',
    newUrl: 'Andere URL analysieren',
    warningsTitle: 'Warnungen:',
    filterShow: 'Anzeigen:',
    filterAll: 'Alle',
    filterFail: 'Nur Fehler',
    filterWarn: 'Nur verbesserbar',
    filterAria: 'Checks filtern',
    categoryEmpty: 'Nichts entspricht diesem Filter in dieser Kategorie.',
    kpis: {
      title: 'Überblick',
      pass: 'Bestanden',
      warn: 'Verbesserbar',
      fail: 'Fehlerhaft',
      checks: '{n} Checks',
    },
    distribution: {
      title: 'Statusverteilung',
    },
    ranking: {
      title: 'Kategorien nach Wirkung',
      subtitle: 'Größte Chancen zuerst',
      impact: 'Wirkung {n}',
    },
    priority: {
      title: 'Vorrangige Empfehlungen',
      subtitle: 'Sortiert nach Gewicht × Schweregrad',
      empty: 'Keine fehlerhaften oder verbesserbaren Checks — super gemacht.',
      inCategory: '{category}',
    },
  },

  tour: {
    toggle: 'Geführte Hilfe',
    close: 'Schließen',
    title: 'Geführte Hilfe',
    hint: 'Tippe auf einen beliebigen Check, um zu erfahren, was er ist, wie er funktionieren sollte und warum er wichtig ist.',
  },

  categoryCard: {
    lockedAria: '{label} (gesperrt)',
    lockedBody:
      'Die Messung der Core Web Vitals (LCP, INP, CLS) erfordert ein Backend mit Felddaten und kann nicht sicher im Browser ausgeführt werden.',
    proCta: 'In der Pro-Version verfügbar',
    scoreAria: 'Teilpunktzahl von {label}',
  },

  detail: {
    what: 'Was es ist',
    why: 'Warum es wichtig ist',
    howToFix: 'Wie man es behebt',
    moreInfo: 'Mehr erfahren ↗',
  },

  errors: {
    unknown: 'Unbekannter Fehler bei der Analyse.',
    fetchFailed:
      'Die Seite konnte nicht abgerufen werden. Prüfe die URL oder versuche es erneut. ({detail})',
    noDetails: 'keine Details',
  },

  warnings: {
    robots: 'robots.txt konnte nicht abgerufen werden.',
    sitemap: 'sitemap.xml konnte nicht abgerufen werden.',
  },

  msg: {
    tech: {
      https: {
        pass: 'Die Seite wird über HTTPS ausgeliefert.',
        fail: 'Die Seite verwendet kein HTTPS; die Verbindung ist nicht verschlüsselt.',
      },
      httpStatus: {
        proxy:
          'Der HTTP-Status ist über den Proxy nicht beobachtbar; es wurden Inhalte abgerufen, also antwortet die Seite.',
        ok: 'Die Seite antwortet {status} OK.',
        other: 'Die Seite antwortet {status}.',
      },
      htmlLang: {
        pass: 'Deklarierte Sprache: "{lang}".',
        fail: 'Das lang-Attribut fehlt am <html>-Tag.',
      },
      viewport: {
        pass: 'Meta-Viewport vorhanden; die Seite ist responsive-ready.',
        fail: 'Meta-Viewport fehlt; die Seite passt sich nicht an Mobilgeräte an.',
      },
      canonical: {
        missing: 'Kein Canonical-Tag gefunden.',
        ok: 'Canonical vorhanden und korrekt formatiert.',
        notAbsolute: 'Canonical vorhanden, aber keine gültige absolute URL.',
      },
      metaRobots: {
        blocks: 'Meta-Robots blockiert Indexierung/Verfolgung ("{value}").',
        ok: 'Meta-Robots blockiert die Indexierung nicht.',
      },
      robotsTxt: {
        missing: '/robots.txt konnte nicht abgerufen werden oder existiert nicht.',
        valid: 'robots.txt existiert und enthält gültige Direktiven.',
        invalid:
          'robots.txt existiert, enthält aber keine erkennbaren User-agent-Direktiven.',
      },
      sitemap: {
        missingRef:
          'robots.txt verweist auf eine Sitemap, aber /sitemap.xml hat nicht geantwortet.',
        missing: 'Kein /sitemap.xml gefunden und kein Verweis in robots.txt.',
        invalid: 'sitemap.xml antwortet, sieht aber nicht wie gültiges Sitemap-XML aus.',
        validRef: 'sitemap.xml ist gültig und in robots.txt referenziert.',
        validNoRef: 'sitemap.xml ist gültig, aber nicht in robots.txt referenziert.',
      },
      urlClean: {
        dirty: 'URL könnte verbessert werden{reasons}.',
        clean: 'Saubere, lesbare URL.',
        tracking: ' (Tracking-Parameter)',
        depth: ' (tiefer Pfad)',
        upper: ' (Großbuchstaben)',
      },
    },
    onpage: {
      title: {
        missing: 'Es gibt kein <title>-Tag.',
        generic: 'Der Title ist generisch ("{title}").',
        optimal: 'Optimaler Title ({len} Zeichen).',
        acceptable:
          'Akzeptabler Title, aber außerhalb des idealen Bereichs von 50-60 ({len} Zeichen).',
        short: 'Title zu kurz ({len} Zeichen).',
        long: 'Title zu lang ({len} Zeichen); er wird in den Ergebnissen abgeschnitten.',
      },
      metaDescription: {
        missing: 'Die Meta-Description fehlt.',
        optimal: 'Optimale Meta-Description ({len} Zeichen).',
        short: 'Kurze Meta-Description ({len} Zeichen); ideal sind 120-160.',
        long: 'Lange Meta-Description ({len} Zeichen); sie wird abgeschnitten.',
      },
      h1Single: {
        one: 'Es gibt genau ein <h1>.',
        none: 'Es gibt kein <h1>.',
        many: 'Es gibt {count} <h1>-Tags; es sollte nur eines geben.',
      },
      headingHierarchy: {
        none: 'Es gibt keine Überschriften, die den Inhalt strukturieren.',
        skipped: 'Die Überschriftenhierarchie überspringt Ebenen (z. B. von h2 zu h4).',
        ok: 'Die Überschriftenhierarchie ist konsistent.',
      },
      wordCount: {
        ok: 'Inhalt mit ausreichender Tiefe ({words} Wörter).',
        short: 'Dünner Inhalt ({words} Wörter); erweitere ihn, um mehr Wert zu bieten.',
      },
      textHtmlRatio: {
        ok: 'Gutes Text/HTML-Verhältnis ({ratio}).',
        low: 'Niedriges Text/HTML-Verhältnis ({ratio}); zu viel Markup im Verhältnis zum Text.',
      },
      imgAlt: {
        none: 'Es gibt keine Bilder auf der Seite.',
        all: 'Jedes Bild hat ein alt-Attribut.',
        partial: 'Nur {withAlt} von {total} Bildern haben ein alt.',
      },
      openGraph: {
        complete: 'Open Graph vollständig (title, description, image).',
        none: 'Keine Open-Graph-Tags.',
        partial: 'Open Graph unvollständig ({count}/3): {missing} fehlt.',
      },
      twitterCards: {
        present: 'Twitter Card deklariert.',
        missing:
          'Keine Twitter Cards; sie verbessern die Darstellung beim Teilen auf X/Twitter.',
      },
      internalLinks: {
        ok: '{count} interne Links erkannt.',
        none:
          'Keine internen Links; das erschwert die Auffindbarkeit und die Verteilung von Autorität.',
        few: 'Nur {count} interne(r) Link(s); füge mehr hinzu, um deine Inhalte zu verlinken.',
      },
    },
    schema: {
      jsonldPresent: {
        present: '{blocks} JSON-LD-Block/-Blöcke gefunden.',
        none: 'Keine strukturierten JSON-LD-Daten.',
      },
      typesDetected: {
        na: 'Kein JSON-LD zum Analysieren.',
        detected: 'Erkannte Typen: {types}.',
        noType: 'Es gibt JSON-LD, aber keinen erkennbaren @type.',
      },
      orgSameas: {
        noOrg: 'Kein Organization-Schema auf der Seite.',
        has: 'Organization enthält sameAs mit verknüpften Profilen.',
        missing:
          'Organization ohne sameAs; füge die offiziellen Profile hinzu, um die Entität zu stärken.',
      },
      authorProfile: {
        na: 'Kein redaktioneller Inhalt (Article/ProfilePage); nicht zutreffend.',
        has: 'Der redaktionelle Inhalt deklariert einen author.',
        missing:
          'Redaktioneller Inhalt ohne deklarierten author; füge author (Person) für E-E-A-T hinzu.',
      },
      syntaxValid: {
        na: 'Kein JSON-LD zum Validieren.',
        valid: 'Alle JSON-LD-Blöcke haben gültige Syntax.',
        invalid:
          '{invalid} von {blocks} JSON-LD-Block/-Blöcken haben Syntaxfehler und werden ignoriert.',
      },
    },
    geo: {
      aiSearchBots: {
        noRobots:
          'Keine robots.txt: standardmäßig kann jeder KI-Suchbot die Seite crawlen und zitieren.',
        allBlocked:
          'Jeder KI-Suchbot ist blockiert: deine Inhalte können nicht in KI zitiert werden. ({summary})',
        someBlocked:
          '{blocked} von {total} KI-Suchbots blockiert. ({summary})',
        allowed: 'Jeder KI-Suchbot kann die Seite crawlen. ({summary})',
      },
      aiTrainingBots: {
        info:
          'Trainingsbots: {blocked} blockiert. Das ist eine legitime Entscheidung und hat keinen Einfluss auf Zitate. ({summary})',
        noRobots: 'Keine robots.txt: jeder Trainingsbot kann die Inhalte nutzen.',
      },
      llmsTxt: {
        missing: 'Keine /llms.txt gefunden.',
        structured:
          'llms.txt vorhanden mit Struktur (Markdown-Überschriften/-Links).',
        unstructured:
          'llms.txt vorhanden, aber ohne erkennbare Markdown-Struktur.',
      },
      bluf: {
        none:
          'Es gibt keinen substanziellen Eröffnungsabsatz, der als direkte Antwort dient.',
        ok: 'Es gibt einen Absatz mit direkter Antwort innerhalb der ersten ~150 Wörter.',
        notLeading:
          'Es gibt substanziellen Inhalt, aber die direkte Antwort erscheint nicht am Anfang.',
      },
      dataDensity: {
        ok: 'Gute Dichte konkreter Daten (Zahlen, Prozentwerte); zitierbarer Inhalt.',
        few: 'Wenige konkrete Datenpunkte; füge mehr überprüfbare Zahlen hinzu.',
        none:
          'Kaum konkrete Daten; der Inhalt ist für KI schwer zu zitieren.',
      },
      promotionalTone: {
        neutral: 'Neutraler, objektiver Ton, geeignet, um von KI zitiert zu werden.',
        promo:
          'Werbliche Sprache erkannt ({hits}), die die Glaubwürdigkeit bei KI verringert.',
      },
      qaFormat: {
        ok: 'Der Inhalt verwendet Fragen als Überschriften (Q&A-Format).',
        few:
          'Wenige oder keine Fragen als Überschriften; das Q&A-Format erleichtert die KI-Extraktion.',
      },
      tables: {
        ok: 'Es gibt {count} Datentabelle(n), für KI leicht zu extrahieren.',
        none:
          'Keine Tabellen; für vergleichbare Daten ist eine Tabelle besser zitierbar als Text.',
      },
      transcript: {
        na: 'Keine Videos oder Embeds, die ein Transkript erfordern.',
        ok: 'Ein Transkript/Untertitel werden neben dem audiovisuellen Inhalt erkannt.',
        missing:
          'Es gibt Video/Embed ohne Text-Transkript; dieser Inhalt ist für KI unsichtbar.',
      },
      semanticHtml: {
        divSoup: '"div-soup"-Struktur ({divs} divs, 0 semantische Elemente).',
        good: 'Gutes semantisches HTML ({count} semantische Elemente).',
        some:
          'Etwas semantisches HTML ({count} Elemente), aber divs dominieren ({divs}).',
      },
      jsDependency: {
        fail:
          'Das initiale HTML hat fast keinen Text ({words} Wörter) und hängt von JavaScript ab: unsichtbar für viele KI-Crawler.',
        warn:
          'Mögliche JavaScript-Abhängigkeit ({words} Wörter im HTML, {scripts} Scripts).',
        pass:
          'Der Hauptinhalt steht im initialen HTML ({words} Wörter), lesbar ohne Ausführung von JavaScript.',
      },
    },
    perf: {
      coreWebVitals:
        'Die Messung der Core Web Vitals (LCP, INP, CLS) erfordert ein Backend. In der Pro-Version verfügbar.',
    },
  },

  val: {
    metaRobotsDefault: 'index,follow (Standard)',
    headings: '{n} Überschriften',
    botsAllowed: '{allowed}/{total} erlaubt',
    figures: '{n} Zahlen',
    figuresPct: '{n} Zahlen, {pct} %',
    expressions: '{n} Ausdrücke',
    questions: '{n} Fragen',
    media: '{n} Medien',
    words: '{n} Wörter',
  },

  check: {
    'tech.https': {
      label: 'HTTPS',
      why: 'HTTPS verschlüsselt die Verbindung und ist ein Vertrauens- und Ranking-Faktor. Browser kennzeichnen HTTP-Seiten als "nicht sicher".',
      howToFix:
        "Installiere ein TLS-Zertifikat (Let's Encrypt ist kostenlos) und erzwinge eine 301-Weiterleitung von HTTP zu HTTPS auf der gesamten Website.",
    },
    'tech.http-status': {
      label: 'HTTP-200-Status',
      why: 'Ein 4xx/5xx verhindert die Indexierung und ruiniert das Nutzererlebnis. Die Seite muss mit 200 OK antworten.',
      howToFix:
        'Prüfe den Server oder das CDN: behebe die Ressource (404), die Berechtigungen (403) oder den Anwendungsfehler (5xx), bis 200 zurückgegeben wird.',
    },
    'tech.html-lang': {
      label: '<html lang>',
      why: 'Das lang-Attribut hilft Suchmaschinen, Screenreadern und KI-Engines, die Sprache des Inhalts zu verstehen.',
      howToFix: 'Füge die Sprache zum Root-Tag hinzu, z. B. <html lang="de">.',
    },
    'tech.viewport': {
      label: 'Meta-Viewport',
      why: 'Das Viewport-Meta-Tag ist für die responsive Darstellung auf Mobilgeräten erforderlich; ohne es wird die Seite herausgezoomt dargestellt.',
      howToFix:
        'Füge <meta name="viewport" content="width=device-width, initial-scale=1"> zum <head> hinzu.',
    },
    'tech.canonical': {
      label: 'Canonical-URL',
      why: 'Das Canonical-Tag konsolidiert doppelte oder parametrisierte URLs zu einer einzigen und bündelt so die Ranking-Signale.',
      howToFix:
        'Füge <link rel="canonical" href="https://…"> mit der absoluten bevorzugten URL in den <head> ein.',
    },
    'tech.meta-robots': {
      label: 'Meta-Robots',
      why: 'Ein noindex/nofollow im Meta-Robots entfernt die Seite aus den Suchergebnissen und stoppt das Verfolgen von Links.',
      howToFix:
        'Entferne noindex/nofollow aus dem Meta-Robots-Tag, wenn die Seite indexiert werden soll, oder belasse es nur auf privaten Seiten.',
    },
    'tech.robots-txt': {
      label: 'robots.txt',
      why: 'robots.txt steuert, worauf Crawler zugreifen dürfen. Eine fehlende oder defekte Datei kann Crawling-Probleme verursachen.',
      howToFix:
        'Veröffentliche eine gültige /robots.txt mit User-agent- und Allow/Disallow-Regeln und verweise auf deine Sitemap.',
    },
    'tech.sitemap': {
      label: 'sitemap.xml',
      why: 'Die Sitemap listet deine URLs auf, damit Engines sie schneller entdecken und indexieren, besonders bei großen Websites.',
      howToFix:
        'Erstelle eine gültige /sitemap.xml, halte sie aktuell und verweise in robots.txt mit "Sitemap:" darauf.',
    },
    'tech.url-clean': {
      label: 'Saubere URL',
      why: 'Kurze, lesbare URLs ohne Tracking-Parameter oder übermäßige Tiefe sind nutzer- und engine-freundlicher.',
      howToFix:
        'Verwende kleingeschriebene, beschreibende Slugs, vermeide Tracking-Parameter in indexierbaren URLs und halte die Pfadtiefe gering.',
    },
    'onpage.title': {
      label: 'Title-Tag',
      why: 'Das <title> ist das wichtigste Signal in Ergebnissen und KI-Antworten. Länge und Einzigartigkeit beeinflussen CTR und Ranking.',
      howToFix:
        'Schreibe einen einzigartigen, beschreibenden Title mit 50-60 Zeichen und dem Hauptkeyword nahe am Anfang.',
    },
    'onpage.meta-description': {
      label: 'Meta-Description',
      why: 'Die Meta-Description ist das Snippet in den Ergebnissen. Sie rankt nicht direkt, beeinflusst aber stark die CTR.',
      howToFix:
        'Schreibe eine ansprechende Beschreibung mit 120-160 Zeichen, die die Seite zusammenfasst und zum Klick einlädt.',
    },
    'onpage.h1-single': {
      label: 'Einzelnes H1',
      why: 'Das H1 ist die Hauptüberschrift des Inhalts. Genau eines hält die Hierarchie für Nutzer und Crawler klar.',
      howToFix:
        'Belasse ein einzelnes <h1>, das die Seite beschreibt, und verwende <h2>-<h6> für die übrige Struktur.',
    },
    'onpage.heading-hierarchy': {
      label: 'Überschriftenhierarchie',
      why: 'Eine Hierarchie ohne übersprungene Ebenen (h1→h2→h3) hilft der Barrierefreiheit und dem Inhaltsverständnis durch KI.',
      howToFix:
        'Überspringe keine Ebenen: nach einem h2 verwende h3, nicht h4. Strukturiere Überschriften nach ihrer Bedeutung, nicht nach ihrer Größe.',
    },
    'onpage.word-count': {
      label: 'Inhaltstiefe',
      why: 'Ausreichend Inhalt ermöglicht es, das Thema abzudecken, und gibt Engines und KI Material zum Verstehen und Zitieren.',
      howToFix:
        'Erweitere den Inhalt, um das Thema gründlich abzudecken (300+ Wörter als Richtwert), ohne Füllmaterial.',
    },
    'onpage.text-html-ratio': {
      label: 'Text/HTML-Verhältnis',
      why: 'Ein sehr niedriges Verhältnis von sichtbarem Text zu Markup kann auf dünnen Inhalt oder übermäßig schweren Code hindeuten.',
      howToFix:
        'Reduziere unnötiges Markup und Inline-Code und priorisiere echten sichtbaren Inhalt.',
    },
    'onpage.img-alt': {
      label: 'Bilder mit alt',
      why: 'Der alt-Text beschreibt Bilder für Screenreader und Engines und hilft bei der Bildersuche.',
      howToFix:
        'Füge jedem bedeutsamen Bild ein beschreibendes alt hinzu; verwende ein leeres alt="" nur für dekorative Bilder.',
    },
    'onpage.open-graph': {
      label: 'Open Graph',
      why: 'Open-Graph-Tags steuern, wie der Link beim Teilen in sozialen Medien aussieht (Titel, Beschreibung, Bild).',
      howToFix:
        'Füge og:title, og:description und og:image mit einem Bild von mindestens 1200×630 px hinzu.',
    },
    'onpage.twitter-cards': {
      label: 'Twitter Cards',
      why: 'Twitter Cards definieren die Rich-Vorschau beim Teilen auf X/Twitter und verbessern die Sichtbarkeit.',
      howToFix:
        'Füge twitter:card hinzu (z. B. summary_large_image); für den Rest wird auf Open Graph zurückgegriffen.',
    },
    'onpage.internal-links': {
      label: 'Interne Links',
      why: 'Interne Links verteilen Autorität und helfen Nutzern und Crawlern, verwandte Inhalte zu entdecken.',
      howToFix:
        'Füge kontextbezogene Links zu anderen relevanten Seiten mit beschreibendem Ankertext hinzu.',
    },
    'schema.jsonld-present': {
      label: 'JSON-LD vorhanden',
      why: 'Strukturierte JSON-LD-Daten ermöglichen es Engines und KI, Entitäten zu verstehen, und aktivieren Rich Results.',
      howToFix:
        'Füge einen <script type="application/ld+json">-Block mit dem zur Seite passenden schema.org-Typ hinzu.',
    },
    'schema.types-detected': {
      label: 'Schema-Typen',
      why: 'Der deklarierte @type (Article, Product, FAQPage…) sagt Engines, um welche Art von Inhalt es sich handelt.',
      howToFix:
        'Verwende den zur Seite passenden schema.org-Typ und vervollständige seine erforderlichen Eigenschaften.',
    },
    'schema.org-sameas': {
      label: 'Organization + sameAs',
      why: 'sameAs verknüpft deine Organization mit ihren offiziellen Profilen und stärkt so die Entität für Engines und KI.',
      howToFix:
        'Füge sameAs mit den URLs deiner offiziellen Social- und Referenzprofile im Organization-Schema hinzu.',
    },
    'schema.author-profile': {
      label: 'Autor (E-E-A-T)',
      why: 'Den author bei redaktionellen Inhalten zu deklarieren, stärkt Erfahrung und Autorität (E-E-A-T).',
      howToFix:
        'Füge author (Person) mit Namen und idealerweise einem sameAs zum Autorenprofil hinzu.',
    },
    'schema.syntax-valid': {
      label: 'Gültige JSON-LD-Syntax',
      why: 'Ein JSON-LD-Block mit Syntaxfehlern wird vollständig ignoriert und sein Potenzial verschenkt.',
      howToFix:
        'Validiere das JSON-LD mit einem Linter oder dem Rich Results Test und behebe alle Parsing-Fehler.',
    },
    'geo.ai-search-bots': {
      label: 'KI-Suchbots',
      why: 'KI-Suchbots (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) treiben Live-Abrufe und Zitate an. Sie zu blockieren bedeutet, dass deine Website nicht in KI-Antworten zitiert werden kann.',
      howToFix:
        'Blockiere in robots.txt nicht die KI-Such-User-agents, von denen du zitiert werden möchtest; erlaube mindestens den Root-Pfad.',
    },
    'geo.ai-training-bots': {
      label: 'KI-Trainingsbots',
      why: 'Trainingsbots (GPTBot, ClaudeBot, Google-Extended…) nutzen Inhalte, um Modelle zu trainieren. Sie zu blockieren ist legitim und hat keinen Einfluss auf Zitate.',
      howToFix:
        'Entscheide bewusst: blockiere sie, wenn du das Training nicht speisen möchtest, aber wisse, dass dies Zitate weder verbessert noch verschlechtert.',
    },
    'geo.llms-txt': {
      label: 'llms.txt',
      why: 'llms.txt ist eine aufkommende Konvention, um KI-Modelle in Markdown zu deinen wichtigsten Inhalten zu leiten.',
      howToFix:
        'Veröffentliche eine /llms.txt mit Überschriften und Markdown-Links zu deinen wichtigsten Seiten.',
    },
    'geo.bluf': {
      label: 'Direkte Antwort (BLUF)',
      why: 'Eine direkte Antwort gleich zu Beginn (Bottom Line Up Front) erleichtert es der KI, deinen Inhalt zu extrahieren und zu zitieren.',
      howToFix:
        'Beginne mit einem substanziellen Absatz, der die Absicht der Seite direkt in den ersten ~150 Wörtern beantwortet.',
    },
    'geo.data-density': {
      label: 'Datendichte',
      why: 'Konkrete Daten (Zahlen, Prozentwerte, Datumsangaben) machen Inhalte für KI zitierbarer und überprüfbarer.',
      howToFix:
        'Füge überprüfbare Zahlen, Statistiken und konkrete Daten hinzu, um deine Aussagen zu untermauern.',
    },
    'geo.promotional-tone': {
      label: 'Objektiver Ton',
      why: 'Übermäßig werbliche Sprache ("der Beste", "unschlagbar") verringert die Glaubwürdigkeit bei KI-Engines.',
      howToFix:
        'Ersetze Marketing-Aussagen durch überprüfbare Fakten und einen neutralen, objektiven Ton.',
    },
    'geo.qa-format': {
      label: 'Q&A-Format',
      why: 'Fragen als Überschriften entsprechen der Art, wie Menschen KI fragen, und erleichtern die Extraktion von Antworten.',
      howToFix:
        'Verwandle Schlüsselabschnitte in Fragen (h2/h3), gefolgt von einer direkten Antwort.',
    },
    'geo.tables': {
      label: 'Datentabellen',
      why: 'Tabellen strukturieren vergleichbare Daten, damit KI sie zuverlässiger extrahieren und zitieren kann als Fließtext.',
      howToFix:
        'Präsentiere vergleichende oder numerische Daten in <table> mit klaren Überschriften statt in Absätzen.',
    },
    'geo.transcript': {
      label: 'Video-Transkript',
      why: 'KI kann keine Videos ansehen; ohne ein Text-Transkript ist dieser Inhalt für KI-Engines unsichtbar.',
      howToFix:
        'Füge ein Text-Transkript oder <track>-Untertitel neben jedem Video oder Embed hinzu.',
    },
    'geo.semantic-html': {
      label: 'Semantisches HTML',
      why: 'Semantische Elemente (article, section, main…) helfen der KI, Struktur und Bedeutung des Inhalts zu verstehen.',
      howToFix:
        'Ersetze generische divs durch semantische Tags (article, main, section, header, footer).',
    },
    'geo.js-dependency': {
      label: 'JavaScript-Abhängigkeit',
      why: 'Wenn der Hauptinhalt erst nach Ausführung von JavaScript erscheint, werden ihn viele KI-Crawler nicht sehen.',
      howToFix:
        'Liefere den Hauptinhalt im initialen HTML aus (SSR/SSG), damit er ohne Ausführung von JS lesbar ist.',
    },
    'perf.core-web-vitals': {
      label: 'Core Web Vitals',
      why: 'LCP, INP und CLS messen reales Laden, Interaktivität und visuelle Stabilität — Ranking-Faktoren von Google.',
      howToFix:
        'Optimiere Bilder, reduziere blockierendes JavaScript und reserviere Platz für Elemente, um Layout-Verschiebungen zu vermeiden.',
    },
  },
};

export default de;

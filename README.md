# SEO + GEO Analyzer

Aplicación web que analiza cualquier URL y muestra un dashboard con cómo de
optimizada está para **SEO clásico** y para **GEO** (Generative Engine
Optimization: aparecer citado en respuestas de IA como ChatGPT, Claude y
Perplexity). Cada hallazgo explica **qué es**, **por qué importa** y **cómo
arreglarlo**.

## Arquitectura

- **Next.js (App Router) + TypeScript**, exportado como **estático**
  (`output: 'export'`) para desplegarse en hosting sin backend (9pm.ai).
- **Sin backend**: todo el análisis ocurre en el navegador del cliente.
- **Capa `fetcher`**: los recursos externos (HTML, robots.txt, sitemap.xml,
  llms.txt) se obtienen vía una cadena de transportes con fallback —
  `directo → allorigins → corsproxy` — con timeout por petición y errores
  aislados por recurso. Está diseñada para **conmutar a un backend propio**
  sustituyendo la lista `TRANSPORTS` en `lib/fetcher.ts`, sin tocar los módulos
  de análisis.
- **Rendimiento (Core Web Vitals)** es un módulo *stub* marcado como
  `requiresBackend` (medirlo requiere una API key que quedaría expuesta en el
  cliente). En la UI aparece bloqueado con CTA "Disponible en la versión Pro".
- **Dependencia de JavaScript** se estima de forma **heurística** sobre el HTML;
  no se usa navegador headless.

## Estructura

```
app/         layout, page (home → loading → dashboard), globals.css
components/  UrlInput, LoadingState, Dashboard, ScoreGauge, CategoryCard,
             CheckRow, CheckDetail
lib/
  fetcher.ts          transporte con fallback de proxies (swappable a backend)
  types.ts            tipos base (CheckResult, CategoryResult, AnalysisResult)
  checks-catalog.ts   metadatos de cada check (label, why, howToFix, weight)
  scoring.ts          score por categoría y global ponderado + etiquetas
  status-meta.ts      icono + texto por estado (accesibilidad)
  analyzer/
    index.ts          orquestador (fetch + parse + módulos + scoring)
    context.ts        contexto compartido por los módulos
    technical.ts      Bloque A · SEO técnico
    onpage.ts         Bloque B · On-page
    schema.ts         Bloque C · Schema (JSON-LD)
    geo.ts            Bloque D · GEO (bots de IA, llms.txt, BLUF, …)
    performance.ts    Bloque E · Rendimiento (stub requiresBackend)
    utils.ts          helpers de extracción de texto
```

## Scoring

Por check: `pass = 1`, `warn = 0.5`, `fail = 0`. `info`/`na` se excluyen.
Score de categoría = `Σ(fracción × peso) / Σ(pesos) × 100`.
Score global = media ponderada de categorías: SEO técnico 25 %, On-page 25 %,
Schema 15 %, GEO 25 %, Rendimiento 10 %. En v1, como Rendimiento está
deshabilitado, su 10 % se reparte proporcionalmente entre las demás.
Etiquetas: Crítico `<40`, Mejorable `40–70`, Bueno `70–90`, Excelente `>90`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera ./out con los estáticos (output: 'export')
```

El contenido de `out/` es lo que se sube al hosting estático.

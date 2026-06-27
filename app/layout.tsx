import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { TourProvider } from '@/components/tour/TourContext';
import TourOverlay from '@/components/tour/TourOverlay';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SEO + GEO Analyzer',
  description:
    'Analyze any URL and discover how optimized it is for classic SEO and for GEO (appearing in AI answers from ChatGPT, Claude and Perplexity).',
};

// Set the theme before first paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('geonalyzer.theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <TourProvider>
              <Navbar />
              {children}
              <TourOverlay />
            </TourProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

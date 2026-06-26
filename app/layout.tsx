import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SEO + GEO Analyzer',
  description:
    'Analyze any URL and discover how optimized it is for classic SEO and for GEO (appearing in AI answers from ChatGPT, Claude and Perplexity).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

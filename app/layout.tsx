import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEO + GEO Analyzer',
  description:
    'Analiza cualquier URL y descubre cómo de optimizada está para SEO clásico y para GEO (aparecer en respuestas de IA como ChatGPT, Claude y Perplexity).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

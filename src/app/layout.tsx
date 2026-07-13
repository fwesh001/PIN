import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NJPST — Nigerian Journal of Polymer Science and Technology',
  description:
    'Open-access academic journal platform for the Polymer Institute of Nigeria (PIN).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

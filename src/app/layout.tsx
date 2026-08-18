import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'F.R.I.D.A.Y. Study Protocol',
  description: 'Gamified Study & Focus Command System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}

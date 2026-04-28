import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zere Fashion — Әйелдер киімі дүкені | Алматы',
  description: 'Zere Fashion — Алматыдағы сапалы әйелдер киімі дүкені. Көйлектер, блузалар, шалбарлар, пальтолар. Тіркеліңіз және жаңа коллекцияларды бірінші болып алыңыз.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body>
        <Header />
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

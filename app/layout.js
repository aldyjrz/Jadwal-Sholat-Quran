import './globals.css';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

export const metadata = {
  title: 'Jadwal Sholat & Al-Quran',
  description: 'Aplikasi jadwal adzan, waktu sholat, dan recitasi Al-Quran',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ffffff',
  icons: {
    icon: '/vercel.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

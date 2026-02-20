import './globals.css';
import BottomNav from './components/BottomNav';

export const metadata = {
  title: 'Jadwal Sholat & Al-Quran',
  description: 'Aplikasi jadwal adzan, waktu sholat, dan recitasi Al-Quran dengan desain Islami',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0a1a10',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

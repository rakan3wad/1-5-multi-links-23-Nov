import './globals.css';
import { Inter } from 'next/font/google';
import { Tajawal } from 'next/font/google';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { Header } from '@/components/header';
import AuthProvider from '@/components/auth/AuthProvider';
import LanguageProvider from '@/components/language/LanguageProvider';
import { LanguageToggle } from '@/components/language-toggle';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const tajawal = Tajawal({
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400'],
  subsets: ['arabic'],
  variable: '--font-arabic',
});

export const metadata = {
  title: 'Multi Links',
  description: 'Share all your important links in one place',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl" className={`${inter.variable} ${tajawal.variable} ${ibmPlexSansArabic.variable}`}>
      <body className="font-tajawal">
        <Toaster richColors position="top-center" />
        <AuthProvider>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <LanguageToggle />
              <div className="flex-1 pt-16">{children}</div>
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
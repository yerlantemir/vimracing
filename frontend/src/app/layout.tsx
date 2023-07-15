import { Header } from '@/components/Header';
import './globals.css';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'vimracing',
  description: 'Vimracing is a website for racing in vim'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text">
        <div
          className="grow relative"
          style={{
            maxWidth: '75rem'
          }}
        >
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

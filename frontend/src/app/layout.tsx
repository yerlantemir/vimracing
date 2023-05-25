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
      <body className="bg-dark">
        <div
          className="grow relative"
          style={{
            maxWidth: '75rem'
          }}
        >
          <Header />
          <div style={{ paddingTop: '6rem' }}>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

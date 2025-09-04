import './globals.css';
import Navbar from '../components/Navbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'سحتنا ماركت',
  description: 'ماركت بليس صحي متعدد البائعين'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

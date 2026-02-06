import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // <--- This was missing
import CartFloatingIcon from "../components/CartFloatingIcon";

// Import Fonts
import { Playfair_Display, Lato } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const lato = Lato({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: "Echowood Flutes",
  description: "Professional Bansuri Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      {/* Added suppressHydrationWarning to ignore Grammarly/Extensions issues */}
      <body 
        className="font-sans bg-amber-50 text-stone-900 flex flex-col min-h-screen"
        suppressHydrationWarning={true}
      >
        <Providers>
          <Navbar />
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          
          <CartFloatingIcon />
        </Providers>
      </body>
    </html>
  );
}
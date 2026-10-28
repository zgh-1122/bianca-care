import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CardContext";

export const metadata = {
  title: "Bianca | Luxury Organic Skincare",
  description: "Experience clean, luxury skincare with advanced formulas and glowing results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F5DC] text-[#1B4332] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#52B788]/30 selection:text-[#1B4332]">
        
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>

      </body>
    </html>
  );
}
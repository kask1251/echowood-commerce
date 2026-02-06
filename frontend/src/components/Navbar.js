"use client";
import Link from "next/link";
import { useState, useEffect } from "react"; // Added useEffect here
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { cart } = useCart();

  // --- HYDRATION FIX ---
  // We only show the "Red Badge" count after the browser has loaded.
  // This prevents the "Server said 0, Client said X" error.
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  // ---------------------

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false); // Close mobile menu if it was open
    }
  };

  return (
    <nav className="bg-white border-b border-amber-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: Logo, Icons, Desktop Search */}
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-amber-900 rounded-full flex items-center justify-center text-amber-50 font-serif font-bold text-xl">E</div>
            <span className="text-xl md:text-2xl font-bold font-serif text-amber-950 tracking-tight">Echowood</span>
          </Link>

          {/* Desktop Search (Hidden on Mobile) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <input
              type="text"
              placeholder="Search for flutes..."
              className="w-full bg-stone-50 border border-stone-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-stone-400 hover:text-amber-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/shop" className="text-stone-600 hover:text-amber-900 font-medium hidden sm:block">Shop All</Link>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-stone-600 hover:text-amber-900 p-2">
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              
              {/* Only show badge if Mounted (Browser) AND Cart has items */}
              {mounted && cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ROW 2: Mobile Search Bar (Visible only on Mobile) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-3 text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

      </div>
    </nav>
  );
}
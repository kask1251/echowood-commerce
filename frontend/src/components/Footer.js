import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold font-serif text-amber-50 mb-4">Echowood Flutes</h2>
          <p className="mb-4 text-stone-500">
            Handcrafted bamboo flutes for professional musicians. 
            Tuned to perfection by master craftsmen in India.
          </p>
          <div className="flex gap-4">
             {/* Social placeholders */}
             <span className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-900 transition cursor-pointer">IG</span>
             <span className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-900 transition cursor-pointer">FB</span>
             <span className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-900 transition cursor-pointer">YT</span>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-stone-200 font-bold mb-4 uppercase tracking-wider">Shop</h3>
          <ul className="space-y-2">
            <li><Link href="/shop" className="hover:text-amber-500 transition">All Flutes</Link></li>
            <li><Link href="/shop?category=beginner" className="hover:text-amber-500 transition">Beginner Series</Link></li>
            <li><Link href="/shop?category=concert" className="hover:text-amber-500 transition">Concert Series</Link></li>
            <li><Link href="/shop?category=custom" className="hover:text-amber-500 transition">Custom Orders</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-stone-200 font-bold mb-4 uppercase tracking-wider">Contact</h3>
          <p className="mb-2">📍 New Delhi, India</p>
          <p className="mb-2">📧 support@echowood.com</p>
          <p className="mb-2">📱 +91 99999 99999</p>
          <p className="mt-4 text-xs text-stone-600">
            © {new Date().getFullYear()} Echowood Flutes.<br/>All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
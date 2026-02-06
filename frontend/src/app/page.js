import Link from "next/link";
import Image from "next/image";
import AddToCartBtn from "../components/AddToCartBtn";
import { SHOP_CONFIG } from "../utils/config";

const API_BASE_PUBLIC = "http://72.62.246.215:4000";

// Fetch Helper
async function getData(endpoint) {
  try {
    const res = await fetch(`http://127.0.0.1:4000${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) { return []; }
}

export default async function Home() {
  // Parallel Data Fetching for speed
  const [featuredProducts, allProducts] = await Promise.all([
    getData('/products?featured=true&limit=4'), // Get Top 4 Featured
    getData('/products?limit=8') // Get 8 General Products
  ]);

  // Fallback: If no featured products marked in DB, just show first 4
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4);

  return (
    <div className="bg-amber-50 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Background Overlay (You can add a real bg image later) */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-800 opacity-90 z-10"></div>
        {/* Add a background image here if you have one: <Image src="..." fill className="object-cover opacity-50" /> */}
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Masterfully Tuned</span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-amber-50 mb-6 leading-tight">
            The Soul of <span className="text-amber-400">Bamboo</span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Professional grade Indian Bansuri flutes, handcrafted for concert-level precision and deep tonal resonance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-bold transition shadow-lg hover:shadow-amber-500/20">
              Shop All Flutes
            </Link>
            <Link href="#featured" className="bg-transparent border border-stone-500 text-stone-300 hover:text-white hover:border-white px-8 py-4 rounded-full font-bold transition">
              View Best Sellers
            </Link>
          </div>
        </div>
      </section>
{/* 2. CATEGORY WIDGETS */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Flutes */}
          <Link href="/shop?category=flutes" className="bg-white p-6 rounded-xl shadow-xl border border-amber-100 hover:-translate-y-2 transition duration-300 group text-center">
            <div className="h-16 w-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-amber-800 group-hover:text-white transition">
               🎋
            </div>
            <h3 className="font-bold text-amber-950">Flutes</h3>
          </Link>

          {/* Harmonium */}
          <Link href="/shop?category=harmonium" className="bg-white p-6 rounded-xl shadow-xl border border-amber-100 hover:-translate-y-2 transition duration-300 group text-center">
            <div className="h-16 w-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-amber-800 group-hover:text-white transition">
               🎹
            </div>
            <h3 className="font-bold text-amber-950">Harmonium</h3>
          </Link>

          {/* Tabla */}
          <Link href="/shop?category=tabla" className="bg-white p-6 rounded-xl shadow-xl border border-amber-100 hover:-translate-y-2 transition duration-300 group text-center">
            <div className="h-16 w-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-amber-800 group-hover:text-white transition">
               🥁
            </div>
            <h3 className="font-bold text-amber-950">Tabla</h3>
          </Link>

          {/* Guitar */}
          <Link href="/shop?category=guitar" className="bg-white p-6 rounded-xl shadow-xl border border-amber-100 hover:-translate-y-2 transition duration-300 group text-center">
            <div className="h-16 w-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-amber-800 group-hover:text-white transition">
               🎸
            </div>
            <h3 className="font-bold text-amber-950">Guitar</h3>
          </Link>

        </div>
      </section>
      {/* 3. BEST SELLERS / FEATURED */}
      <section id="featured" className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold font-serif text-amber-950 mb-2">Best Selling Flutes</h2>
            <p className="text-amber-900/60">Selected by our master craftsmen</p>
          </div>
          <Link href="/shop" className="text-amber-700 font-bold hover:underline">View All &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayFeatured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMISE BANNER */}
      <section className="bg-amber-900 text-amber-50 py-16 px-4 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-xl font-bold mb-2">✅ 100% Tuned</h4>
            <p className="text-amber-200/80 text-sm">Every flute is checked digitally and by ear.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">🚚 Fast Shipping</h4>
            <p className="text-amber-200/80 text-sm">Secure packaging delivered to your doorstep.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">⭐ Premium Bamboo</h4>
            <p className="text-amber-200/80 text-sm">Aged Assam bamboo for the best resonance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-Component for Clean Code
// Optimized Product Card for Mobile & Desktop
function ProductCard({ product }) {
  const imageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${API_BASE_PUBLIC}${product.imageUrl}`) 
    : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 group overflow-hidden border border-amber-50 flex flex-col">
      
      {/* 1. Clickable Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative h-64 bg-amber-50 overflow-hidden cursor-pointer">
        <Image 
          src={imageUrl} alt={product.name} fill 
          className="object-cover group-hover:scale-105 transition duration-500" 
        />
        
        {/* Desktop Only: Quick View Overlay (Hidden on mobile via 'hidden md:block') */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <span className="block w-full bg-white text-stone-900 text-center py-2 rounded font-bold text-sm hover:bg-amber-50">
            View Details
          </span>
        </div>
      </Link>

      {/* 2. Content */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Clickable Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-stone-800 line-clamp-1 mb-1 hover:text-amber-700 transition">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-stone-500 text-xs mb-3">Professional Quality</p>
        
        <div className="mt-auto flex justify-between items-center gap-3">
          <span className="text-lg font-bold text-amber-900">₹{product.price}</span>
          
          {/* Add to Cart Button */}
          <div className="flex-shrink-0">
             <AddToCartBtn product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
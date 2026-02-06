import Link from "next/link";
import Image from "next/image";
import AddToCartBtn from "../../components/AddToCartBtn";
import { SHOP_CONFIG } from "../../utils/config";

// --- CONFIGURATION ---
const API_BASE_PUBLIC = "http://72.62.246.215:4000"; 
const INTERNAL_API = "http://127.0.0.1:4000";

// --- FETCH DATA ---
async function getProducts(searchParams) {
  // Construct Query String
  const params = new URLSearchParams();
  if (searchParams.search) params.append("search", searchParams.search);
  if (searchParams.category) params.append("category", searchParams.category);
  if (searchParams.min) params.append("minPrice", searchParams.min);
  if (searchParams.max) params.append("maxPrice", searchParams.max);
  
  try {
    const res = await fetch(`${INTERNAL_API}/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function ShopPage({ searchParams }) {
  // Next.js 15: searchParams is a promise
  const resolvedParams = await searchParams;
  const products = await getProducts(resolvedParams);
  
  const currentCategory = resolvedParams.category || "All Flutes";
  const currentSearch = resolvedParams.search || "";

  // Helper for Display Images
  const getImage = (p) => p.imageUrl 
    ? (p.imageUrl.startsWith("http") ? p.imageUrl : `${API_BASE_PUBLIC}${p.imageUrl}`) 
    : "/placeholder.jpg";

  // Categories List for Sidebar
  const categories = [
    { name: "All Flutes", slug: "" },
    { name: "C Sharp Medium", slug: "c-sharp" }, // Ensure these slugs match what you save in DB or use generic search
    { name: "E Bass", slug: "e-bass" },
    { name: "G Base", slug: "g-base" },
    { name: "Beginner Flutes", slug: "beginner" },
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <aside className="md:col-span-1 space-y-8">
          
          {/* Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h3 className="font-serif font-bold text-xl text-amber-950 mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link 
                    href={cat.slug ? `/shop?category=${cat.slug}` : `/shop`}
                    className={`block text-sm ${
                      (cat.slug === resolvedParams.category) || (!cat.slug && !resolvedParams.category)
                        ? "text-amber-700 font-bold" 
                        : "text-stone-600 hover:text-amber-700"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter (Simple Links for now) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h3 className="font-serif font-bold text-xl text-amber-950 mb-4">Price Range</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li><Link href="/shop?max=1000" className="hover:text-amber-700">Under ₹1,000</Link></li>
              <li><Link href="/shop?min=1000&max=5000" className="hover:text-amber-700">₹1,000 - ₹5,000</Link></li>
              <li><Link href="/shop?min=5000" className="hover:text-amber-700">Premium (₹5,000+)</Link></li>
            </ul>
          </div>
        </aside>

        {/* --- RIGHT SIDE: PRODUCT GRID --- */}
        <main className="md:col-span-3">
          
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold font-serif text-amber-950">
              {currentSearch ? `Results for "${currentSearch}"` : "Shop Inventory"}
            </h1>
            <span className="text-stone-500 text-sm">{products.length} Products Found</span>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-amber-100 flex flex-col">
                  
                  {/* Image */}
				<div className="relative h-64 bg-amber-50 border-b border-amber-100">
                    <Image 
                      src={getImage(product)} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="font-bold text-lg text-amber-950 line-clamp-1">{product.name}</h2>
                    <p className="text-xs text-stone-500 mb-3 line-clamp-2 h-8">{product.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-amber-900">₹{product.price}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.stock > 0 ? "In Stock" : "Sold Out"}
                      </span>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                       <AddToCartBtn product={product} />
                       <Link 
                         href={`/product/${product.slug}`}
                         className="flex items-center justify-center bg-stone-100 text-stone-700 text-sm font-bold rounded hover:bg-stone-200 transition"
                       >
                         View
                       </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white p-12 rounded-xl text-center border border-amber-100 shadow-sm">
              <div className="text-5xl mb-4">🧐</div>
              <h3 className="text-xl font-bold text-amber-950 mb-2">No products found</h3>
              <p className="text-stone-500 mb-6">Try adjusting your search or filters.</p>
              <Link href="/shop" className="bg-amber-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-800">
                Clear Filters
              </Link>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
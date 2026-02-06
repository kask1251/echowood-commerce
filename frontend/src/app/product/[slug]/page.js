import Link from "next/link";
import Image from "next/image";
import AddToCartBtn from "../../../components/AddToCartBtn";
import { SHOP_CONFIG } from "../../../utils/config";

// --- CONFIGURATION ---
// ... existing imports ...
const API_BASE_PUBLIC = "http://72.62.246.215:4000"; 

// --- NEW: DYNAMIC METADATA ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`http://127.0.0.1:4000/products/${slug}`);
    const product = await res.json();
    
    if (!product) return { title: "Product Not Found" };

    const imageUrl = product.imageUrl 
      ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${API_BASE_PUBLIC}${product.imageUrl}`)
      : null;

    return {
      title: `${product.name} | Echowood Flutes`,
      description: product.description || "Premium Handcrafted Bansuri",
      openGraph: {
        title: product.name,
        description: `Buy ${product.name} for ₹${product.price}`,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return { title: "Echowood Flutes" };
  }
}

// ... rest of your existing component ...

async function getProduct(slug) {
  try {
    // Server-side fetch uses localhost for speed
    const res = await fetch(`http://127.0.0.1:4000/products/${slug}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <h1 className="text-2xl font-bold text-amber-900">Product Not Found</h1>
        <Link href="/" className="mt-4 text-amber-700 underline">Return to Shop</Link>
      </div>
    );
  }

  // Helper for WhatsApp Link
  const createWhatsAppLink = (n, p) => {
    const msg = SHOP_CONFIG.messages.quickBuy(n, p);
    return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Image Logic
  const displayImage = product.imageUrl
    ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${API_BASE_PUBLIC}${product.imageUrl}`)
    : "/placeholder.jpg";

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <Link href="/" className="text-amber-700/60 hover:text-amber-900 mb-6 inline-block text-sm">
          ← Back to Catalog
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* LEFT: Image Section */}
            <div className="relative h-96 md:h-auto bg-amber-50 border-r border-amber-100">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-contain p-8" // object-contain ensures whole flute is visible
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* RIGHT: Details Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-amber-950 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-amber-900">₹{product.price}</span>
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="prose prose-amber text-amber-900/70 mb-8 leading-relaxed">
                <p>{product.description || "No description available for this premium flute."}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex-1">
                   {/* We pass specific style props to button via CSS if needed, or rely on default */}
                   <AddToCartBtn product={product} /> 
                </div>
                
                <a 
                  href={createWhatsAppLink(product.name, product.price)}
                  target="_blank"
                  className="flex-1 bg-amber-900 text-amber-50 text-center py-4 rounded-lg font-bold hover:bg-amber-800 transition shadow-lg hover:shadow-xl"
                >
                  Buy Now via WhatsApp
                </a>
              </div>
              
              <p className="mt-6 text-xs text-amber-900/40 text-center">
                Secure checkout via WhatsApp. We will confirm shipping details instantly.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
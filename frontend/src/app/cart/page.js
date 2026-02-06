"use client";
import { useCart } from "../../context/CartContext";
import { SHOP_CONFIG } from "../../utils/config";
import Link from "next/link";
import Image from "next/image";

// --- CONFIGURATION ---
const API_BASE_PUBLIC = "http://72.62.246.215:4000";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    let message = `${SHOP_CONFIG.messages.cartCheckout}\n\n`;
    cart.forEach((item, i) => {
      message += `${i + 1}. *${item.name}* (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
    });
    message += `\n💰 *Total Amount: ₹${cartTotal}*`;
    message += `\n\nPlease confirm my order.`;
    
    const url = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-950 mb-8 font-serif">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-amber-100 text-center">
            <p className="text-amber-900/50 text-lg mb-6">Your cart is currently empty.</p>
            <Link href="/" className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition">
              Browse Flutes
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-amber-100/50 border-b border-amber-100">
                  <tr>
                    <th className="p-4 text-amber-900 text-sm font-bold uppercase tracking-wider">Product</th>
                    <th className="p-4 text-amber-900 text-sm font-bold uppercase tracking-wider">Price</th>
                    <th className="p-4 text-amber-900 text-sm font-bold uppercase tracking-wider">Qty</th>
                    <th className="p-4 text-amber-900 text-sm font-bold uppercase tracking-wider">Total</th>
                    <th className="p-4 text-amber-900 text-sm font-bold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-amber-50 rounded border border-amber-100 flex-shrink-0 overflow-hidden">
                            {/* Image Logic applied here too */}
                            <Image 
                               src={
                                item.imageUrl 
                                ? (item.imageUrl.startsWith("http") ? item.imageUrl : `${API_BASE_PUBLIC}${item.imageUrl}`)
                                : "/placeholder.jpg"
                               }
                               alt={item.name} 
                               fill 
                               className="object-cover"
                            />
                          </div>
                          <span className="font-bold text-amber-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-amber-800">₹{item.price}</td>
                      <td className="p-4 text-amber-800">{item.quantity}</td>
                      <td className="p-4 font-bold text-amber-900">₹{item.price * item.quantity}</td>
                      <td className="p-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Checkout */}
            <div className="p-6 bg-amber-50/30 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link href="/" className="text-amber-700 hover:text-amber-900 text-sm font-medium">
                ← Continue Shopping
              </Link>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <div className="text-xl">
                  <span className="text-amber-900/60 mr-2">Total:</span>
                  <span className="font-bold text-amber-900 text-2xl">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>Checkout on WhatsApp</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
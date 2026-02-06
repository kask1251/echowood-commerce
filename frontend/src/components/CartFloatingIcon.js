"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function CartFloatingIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // 1. Wait until the component is mounted on the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. If not mounted yet (Server side), do not render anything
  // This prevents the "Server said X, Client said Y" error.
  if (!mounted) return null;

  // 3. If empty, don't show the floating button (optional, but cleaner)
  if (cart.length === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-amber-900 text-white p-4 rounded-full shadow-xl hover:bg-amber-800 transition z-50 flex items-center justify-center group"
    >
      <div className="relative">
        {/* Cart Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        {/* Badge Count */}
        <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
          {cart.length}
        </span>
      </div>
      
      {/* Tooltip text (Visible on hover) */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out ml-0 group-hover:ml-2 text-sm font-bold">
        Checkout
      </span>
    </Link>
  );
}
"use client";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 font-bold rounded-xl border transition-all duration-200 flex justify-center items-center gap-2 ${
        isAdded 
          ? "bg-stone-800 text-white border-stone-800" 
          : "bg-white text-stone-800 border-stone-300 hover:bg-stone-50"
      }`}
    >
      {isAdded ? (
        <><span>Added</span> <span>✓</span></>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}

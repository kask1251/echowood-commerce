"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// CONFIG
const API_URL = "http://72.62.246.215:4000"; 

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // NEW: Store categories
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "", slug: "", price: "", stock: "", description: "", 
    isFeatured: false, categoryId: "" // NEW: Category selection
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingSlug, setEditingSlug] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("echowood_token");
    if (!storedToken) {
      router.push("/admin");
      return;
    }
    setToken(storedToken);
    fetchProducts();
    fetchCategories(); // NEW: Load categories on boot
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (e) { console.error("Cat fetch failed", e); }
  };

  const fetchProducts = async () => {
    setFetchError(null);
    try {
      const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setFetchError("Could not load products.");
    }
  };

  const handleEditClick = (product) => {
    setEditingSlug(product.slug);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      isFeatured: product.isFeatured || false,
      categoryId: product.categoryId || "" // Load saved category
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setFormData({ name: "", slug: "", price: "", stock: "", description: "", isFeatured: false, categoryId: "" });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = null;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadRes = await fetch(`${API_URL}/admin/upload`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: uploadData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadJson = await uploadRes.json();
        finalImageUrl = uploadJson.url; 
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isFeatured: formData.isFeatured,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null, // Send Category ID
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
      };

      let response;
      if (editingSlug) {
        if (formData.slug !== editingSlug) payload.newSlug = formData.slug;
        response = await fetch(`${API_URL}/products/${editingSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        payload.slug = formData.slug;
        if (!finalImageUrl) payload.imageUrl = "/placeholder.jpg";
        response = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Operation failed");

      alert(editingSlug ? "Product Updated!" : "Product Created!");
      handleCancelEdit();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800">
            {editingSlug ? "Editing Product" : "Shop Manager"}
          </h1>
          <button onClick={() => { localStorage.removeItem("echowood_token"); router.push("/admin"); }} className="text-red-600 underline">Logout</button>
        </div>

        {fetchError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{fetchError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FORM */}
          <div className={`md:col-span-1 p-6 rounded shadow ${editingSlug ? "bg-amber-50 border-2 border-amber-400" : "bg-white"}`}>
            <h2 className="text-xl font-bold mb-4 text-stone-800">{editingSlug ? "Edit Details" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <input placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              
              <input placeholder="Slug (URL ID)" className="w-full border p-2 rounded" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              
              <div className="flex gap-2">
                <input type="number" placeholder="Price" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <input type="number" placeholder="Stock" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>

              {/* NEW CATEGORY DROPDOWN */}
              <div className="bg-stone-50 p-2 rounded border">
                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Category</label>
                <select 
                   className="w-full p-2 bg-white border rounded"
                   value={formData.categoryId}
                   onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">-- Uncategorized --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-stone-100 p-2 rounded border">
                <input type="checkbox" id="featured" className="w-5 h-5 accent-amber-600" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
                <label htmlFor="featured" className="text-sm font-bold text-stone-700 cursor-pointer">Show in "Best Sellers"</label>
              </div>

              <textarea placeholder="Description" className="w-full border p-2 rounded h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              
              <div className="border p-2 rounded bg-white">
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Image</label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-stone-900 text-white p-3 rounded hover:bg-stone-700 font-bold">
                  {loading ? "Saving..." : (editingSlug ? "Update" : "Create")}
                </button>
                {editingSlug && <button type="button" onClick={handleCancelEdit} className="px-4 bg-red-100 text-red-700 rounded font-bold">Cancel</button>}
              </div>
            </form>
          </div>

          {/* LIST */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-stone-800">Inventory ({products.length})</h2>
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 border-b">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={`border-b hover:bg-stone-50 ${editingSlug === p.slug ? "bg-amber-50" : ""}`}>
                      <td className="p-3">
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-stone-500">Stock: {p.stock} | ₹{p.price}</div>
                        {p.isFeatured && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold border border-amber-200">BEST SELLER</span>}
                      </td>
                      <td className="p-3">
                        {p.category ? (
                           <span className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded border">{p.category.name}</span>
                        ) : <span className="text-xs text-stone-400">-</span>}
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleEditClick(p)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
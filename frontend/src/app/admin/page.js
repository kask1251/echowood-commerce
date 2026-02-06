"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// UPDATED IP
const API_URL = "http://72.62.246.215:4000";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("echowood_token", data.token);
      router.push("/admin/dashboard");
      
    } catch (err) {
      setError("Login failed. Check username/password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-stone-800">Admin Login</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Username</label>
          <input type="text" className="w-full border p-2 rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-stone-900 text-white p-2 rounded hover:bg-stone-700">Enter Dashboard</button>
      </form>
    </div>
  );
}
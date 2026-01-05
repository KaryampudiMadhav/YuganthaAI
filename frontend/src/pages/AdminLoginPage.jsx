import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@yuganthaai.com";
const ADMIN_PASSWORD = "Admin123!";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const authed = localStorage.getItem("adminAuthed") === "true";
    if (authed) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid admin credentials. Try again.");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminAuthed", "true");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-400">Admin Panel</p>
          <h1 className="text-2xl font-bold">Admin Sign In</h1>
          <p className="text-sm text-gray-500">Use the static admin credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder={ADMIN_EMAIL}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
            Sign In
          </button>
        </form>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Demo credentials</p>
          <p>Email: {ADMIN_EMAIL}</p>
          <p>Password: {ADMIN_PASSWORD}</p>
        </div>
      </div>
    </div>
  );
}

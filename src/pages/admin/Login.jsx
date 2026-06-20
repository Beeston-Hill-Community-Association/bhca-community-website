import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"
      >
        <div className="mb-8 text-center">
          <img
            src="/logos/TEXT_LOGO.png"
            alt="Beeston Hill Community Association"
            className="mx-auto mb-5 h-24 w-auto"
          />

          <span className="inline-block rounded-full bg-[#5e17eb]/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#5e17eb]">
            Admin Portal
          </span>

          <h1 className="mt-4 text-3xl font-black text-[#171717]">
            BHCA Admin
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage website content
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/admin/forgot-password"
            className="text-sm font-bold text-[#5e17eb] hover:text-[#ff914d]"
          >
            Forgotten your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
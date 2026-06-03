import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/admin/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password reset email sent. Please check your inbox.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-center text-3xl font-black text-[#171717]">
          Reset password
        </h1>

        <p className="text-center text-sm text-gray-500">
          Enter your admin email and we’ll send a reset link.
        </p>

        {message && (
          <p className="rounded-xl bg-green-50 p-3 text-center text-sm font-bold text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <div className="text-center">
          <Link
            to="/admin/login"
            className="text-sm font-bold text-[#5e17eb] hover:text-[#ff914d]"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
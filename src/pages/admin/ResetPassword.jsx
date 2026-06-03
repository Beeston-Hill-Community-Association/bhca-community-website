import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully.");

    setTimeout(() => {
      navigate("/admin/login");
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-center text-3xl font-black text-[#171717]">
          Choose new password
        </h1>

        <p className="text-center text-sm text-gray-500">
          Enter a new password for your admin account.
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
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
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
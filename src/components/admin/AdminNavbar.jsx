import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const navLinks = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Events", path: "/admin/events" },
  { label: "News", path: "/admin/news" },
  { label: "Gallery", path: "/admin/gallery" },
  { label: "Action Plan", path: "/admin/ActionPlan" },
  { label: "Local Events", path: "/admin/localevents" },
  { label: "Photo Credits", path: "/admin/photo-credits" },
];

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <nav className="bg-[#5e17eb] text-white py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 px-6">
        <h1
          className="cursor-pointer text-2xl font-bold"
          onClick={() => navigate("/admin/dashboard")}
        >
          BHCA Admin
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`text-sm transition hover:text-[#ff914d] ${
                pathname === path
                  ? "font-semibold text-[#ff914d]"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="rounded bg-[#ff914d] px-4 py-1 text-sm font-semibold text-[#171717] transition hover:bg-[#ffb570]"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
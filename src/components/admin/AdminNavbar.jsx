import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import useAdminRole from "../../hooks/useAdminRole";

const mainLinks = [
  { label: "Dashboard", path: "/admin/dashboard" },
];

const contentLinks = [
  { label: "Events", path: "/admin/events" },
  { label: "News", path: "/admin/news" },
  { label: "Gallery", path: "/admin/gallery" },
  { label: "Action Plan", path: "/admin/action-plan" },
  { label: "Local Events", path: "/admin/localevents" },
  { label: "Photo Credits", path: "/admin/photo-credits" },
  { label: "Useful Info", path: "/admin/useful-info" },
  { label: "Search Logs", path: "/admin/search-logs" },
];

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role, isSuperAdmin } = useAdminRole();

  const [contentOpen, setContentOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <nav className="bg-[#5e17eb] py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 px-6">
        <h1
          className="cursor-pointer text-2xl font-bold"
          onClick={() => navigate("/admin/dashboard")}
        >
          BHCA Admin
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {mainLinks.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={`text-sm transition hover:text-[#ff914d] ${
                pathname === path ? "font-semibold text-[#ff914d]" : ""
              }`}
            >
              {label}
            </button>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setContentOpen(!contentOpen)}
              className="text-sm transition hover:text-[#ff914d]"
            >
              Content ▾
            </button>

            {contentOpen && (
              <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl bg-white py-2 text-[#171717] shadow-xl">
                {contentLinks.map(({ label, path }) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      navigate(path);
                      setContentOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      pathname === path
                        ? "font-semibold text-[#5e17eb]"
                        : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin/Users")}
              className={`text-sm transition hover:text-[#ff914d] ${
                pathname === "/admin/Users"
                  ? "font-semibold text-[#ff914d]"
                  : ""
              }`}
            >
              Users
            </button>
          )}

          {role && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {role === "super_admin" ? "Super admin" : "Admin"}
            </span>
          )}

          <button
            type="button"
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
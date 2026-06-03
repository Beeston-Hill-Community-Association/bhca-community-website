import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import useAdminRole from "../../hooks/useAdminRole";
import { ADMIN_INVITE_URL } from "../../lib/config";

export default function AdminUsers() {
  const { isSuperAdmin, loadingRole } = useAdminRole();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!loadingRole && isSuperAdmin) {
      fetchUsers();
    }
  }, [loadingRole, isSuperAdmin]);

  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Could not load admin users.");
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  }

  async function inviteUser(e) {
    e.preventDefault();

    if (!inviteEmail) {
      alert("Please enter an email address.");
      return;
    }

    setInviting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to invite users.");
      }

      const response = await fetch(ADMIN_INVITE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invite failed.");
      }

      alert(`Invite sent to ${inviteEmail}`);

      setInviteEmail("");
      setInviteRole("admin");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    setInviting(false);
  }

  async function updateRole(user, role) {
    const { error } = await supabase
      .from("admin_users")
      .update({ role })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("Could not update role.");
      return;
    }

    setUsers((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, role } : item))
    );
  }

  async function removeUser(user) {
    if (!confirm(`Remove admin access for ${user.email}?`)) return;

    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("Could not remove admin user.");
      return;
    }

    setUsers((prev) => prev.filter((item) => item.id !== user.id));
  }

  if (loadingRole) {
    return (
      <AdminLayout>
        <p>Checking permissions...</p>
      </AdminLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-black text-[#171717]">
            Access denied
          </h1>

          <p className="text-gray-600">
            Only super admins can manage admin users.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-black text-[#171717]">
        Admin Users
      </h1>

      <form
        onSubmit={inviteUser}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          Invite new admin user
        </h2>

        <p className="text-sm text-gray-500">
          Send an invite email and assign the user an admin role.
        </p>

        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Email address"
          className="rounded-xl border p-3"
          required
        />

        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="admin">Admin</option>
          <option value="super_admin">Super admin</option>
        </select>

        <button
          type="submit"
          disabled={inviting}
          className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {inviting ? "Sending invite..." : "Send invite"}
        </button>
      </form>

      {loading ? (
        <p>Loading admin users...</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center"
            >
              <div>
                <h3 className="font-black text-[#171717]">{user.email}</h3>
                <p className="text-xs text-gray-500">{user.id}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user, e.target.value)}
                  className="rounded-xl border px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super admin</option>
                </select>

                <button
                  onClick={() => removeUser(user)}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Remove access
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useAdminRole() {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("AUTH USER:", user, userError);

      if (!user) {
        setRole(null);
        setLoadingRole(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      console.log("ADMIN ROLE:", data, error);

      setRole(data?.role || null);
      setLoadingRole(false);
    }

    loadRole();
  }, []);

  return {
    role,
    loadingRole,
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin" || role === "super_admin",
  };
}
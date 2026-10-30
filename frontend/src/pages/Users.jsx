import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "sonner";
import { Users as UsersIcon, Clock } from "lucide-react";
import UserSearchBar from "../components/UserSearchBar";
import PendingRequests from "../components/PendingRequests";
import UsersTable from "../components/UsersTable";
import { useAuth } from "../components/context/AuthContext";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, email, role, requested_access, created_at")
        .order("requested_access", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId, userIdentifier) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin", requested_access: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success(`Approved admin access for ${userIdentifier}`);
      fetchUsers();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve access request.");
    }
  };

  const handleDeny = async (userId, userIdentifier) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ requested_access: false })
        .eq("id", userId);

      if (error) throw error;

      toast.info(`Declined access request for ${userIdentifier}`);
      fetchUsers();
    } catch (error) {
      console.error("Error denying request:", error);
      toast.error("Failed to deny access request.");
    }
  };

  const handleRoleChange = async (userId, newRole, userIdentifier) => {
    if (userId === currentUser?.id && newRole !== "admin") {
      toast.error("You cannot demote your own account.");
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole, requested_access: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success(
        `Updated ${userIdentifier}'s role to ${newRole.toUpperCase()}`,
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const pendingUsers = users.filter((u) => u.requested_access);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = u.display_name?.toLowerCase().includes(term);
    const emailMatch = u.email?.toLowerCase().includes(term);
    return nameMatch || emailMatch;
  });

  return (
    <div className="flex-1 text-[var(--text-primary)] p-10 flex flex-col gap-4">
      <div className="mb-3 hidden md:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Operations Control Center
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Users & Access Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            View and manage team-member roles.
          </p>
        </div>
      </div>
      <PendingRequests
        pendingUsers={pendingUsers}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
      <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div
        className=" 
        bg-[var(--bg-card)] 
        rounded-xl 
        p-4 
        backdrop-blur-[var(--backdrop-blur)]
        [border:var(--border-card)]
        w-full
        "
      >
        <h2 className="text-[var(--text-primary)] font-semibold mb-2">
          Registered Users
        </h2>
        <UsersTable
          filteredUsers={filteredUsers}
          loading={loading}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
}

export default Users;

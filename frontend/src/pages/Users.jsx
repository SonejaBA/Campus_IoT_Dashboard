import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import UserSearchBar from "../components/UserSearchBar";
import PendingRequests from "../components/PendingRequests";
import UsersTable from "../components/UsersTable";
import { useAuth } from "../components/context/AuthContext";
import { authFetch } from "../services/supabaseClient";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    display_name: "",
    password: "",
    role: "viewer",
  });
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveUser = async () => {
    // 1. Basic validation
    if (
      !newUser.email.trim() ||
      !newUser.display_name.trim() ||
      !newUser.password.trim() ||
      !newUser.role
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      // 2. Fire the POST request to your backend
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newUser.email.trim(),
            display_name: newUser.display_name.trim(),
            password: newUser.password.trim(),
            role: newUser.role,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create user.");
      }

      // 3. Reset the form and close the modal
      setNewUser({
        email: "",
        display_name: "",
        password: "",
        role: "viewer",
      });
      setShowAddModal(false);

      // 4. Alert and refresh
      alert("User provisioned successfully.");
      window.location.reload(); // Or fetchUsers() if you are managing table state locally
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message || "Failed to create user.");
    }
  };

  const handleCreateUser = async (newUserData) => {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserData),
        },
      );

      if (!response.ok) throw new Error("Failed to create user");

      toast.success("Account provisioned!");
      setShowAddModal(false);
      fetchUsers(); // Refresh the table
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this user?")
    )
      return;

    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      fetchUsers(); // Refresh your table state
    } catch (error) {
      toast.error(error.message);
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

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(true);
            setNewUser({
              email: "",
              display_name: "",
              password: "",
              role: "viewer",
            });
          }}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--control-border)] backdrop-blur-[var(--backdrop-blur)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
        >
          <Plus size={17} />
          Add user
        </button>
        <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

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
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card-strong)] [border:var(--border-card)] p-6 shadow-[var(--shadow-card)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Add User</h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Provision a new dashboard account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddUserChange}
                  placeholder="youremail@gmail.com"
                  className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="display_name"
                  value={newUser.display_name}
                  onChange={handleAddUserChange}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={newUser.password}
                    onChange={handleAddUserChange}
                    placeholder="SacState2026!"
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleAddUserChange}
                    className="w-full rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 py-2.5 text-sm text-[var(--control-text)] outline-none"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveUser}
                className="rounded-lg border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 py-2.5 text-sm font-medium text-[var(--control-text)] transition hover:bg-[var(--control-hover)]"
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

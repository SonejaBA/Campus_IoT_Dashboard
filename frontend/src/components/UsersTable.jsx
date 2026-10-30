import { ShieldCheck, UserCheck, Clock, Eye } from "lucide-react";

const mockFilteredUsers = [
  {
    id: "user-1",
    display_name: "Sarah Jenkins",
    email: null,
    requested_access: false,
    role: "admin",
  },
  {
    id: "user-2",
    display_name: "Alex Rivera",
    email: "alex.rivera@example.com",
    requested_access: true, // Tests the pending request state
    role: "viewer",
  },
  {
    id: "user-3",
    display_name: "Marcus Chen",
    email: "marcus.chen@example.com",
    requested_access: false,
    role: "viewer",
  },
  {
    id: "user-4",
    display_name: null, // Tests the "Unnamed User" fallback
    email: "orphan.user.99@example.com",
    requested_access: true, // Tests pending request + fallback email
    role: "viewer",
  },
  {
    id: "user-5",
    display_name: null,
    email: "elena.rostova@example.com",
    requested_access: false,
    role: "admin",
  },
];

function UsersTable({
  filteredUsers = mockFilteredUsers,
  loading,
  onRoleChange,
}) {
  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
        Loading user profiles...
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
        No user profiles match your search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">User</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Current Role</th>
            <th className="py-3 px-4 font-semibold text-right">Role Action</th>
          </tr>
        </thead>

<tbody className="divide-y divide-[var(--border-subtle)] text-sm">
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-[var(--bg-hover)] transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-medium text-[var(--text-primary)]">
                  {user.display_name || "Unnamed User"}
                </div>
                <div className="text-xs text-[var(--text-secondary)] truncate">
                  {user.email || user.id}
                </div>
              </td>

              <td className="py-3.5 px-4">
                {user.requested_access ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-warning)] font-medium">
                    <Clock size={14} /> Request Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <UserCheck size={14} /> Active
                  </span>
                )}
              </td>

              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    user.role === "admin"
                      ? "bg-[var(--bg-card)] text-[var(--text-good)] [border:var(--border-good)]"
                      : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-gray-500/20"
                  }`}
                >
                  {user.role === "admin" && <ShieldCheck size={12} />}
                  {user.role === "viewer" && <Eye size={12} />}
                  {user.role}
                </span>
              </td>

              <td className="py-3.5 px-4 text-right">
                <select
                  value={user.role || "viewer"}
                  onChange={(e) =>
                    onRoleChange(
                      user.id,
                      e.target.value,
                      user.display_name || user.email
                    )
                  }
                  className="
                    bg-[var(--control-bg)] 
                    border 
                    border-[color:var(--control-border)] 
                    text-[var(--control-text)] 
                    text-xs 
                    rounded-lg 
                    px-2.5 
                    py-1.5 
                    cursor-pointer 
                    focus:outline-none 
                    focus:ring-1 
                    focus:ring-[var(--slider-focus)]
                  "
                >
                  <option value="viewer" className="bg-[var(--bg-card)]">
                    Viewer
                  </option>
                  <option value="admin" className="bg-[var(--bg-card)]">
                    Admin
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;

import { ShieldAlert, Check, X } from "lucide-react";

function PendingRequests({ pendingUsers, onApprove, onDeny }) {
  if (!pendingUsers || pendingUsers.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl bg-[var(--bg-card)] backdrop-blur-[var(--backdrop-blur)] [border:var(--border-card)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={18} />
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Pending Access Requests ({pendingUsers.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-[var(--bg-card-strong)] [border:var(--border-subtle)]"
          >
            <div className="mb-3">
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                {user.display_name || "Unnamed User"}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {user.email || "No email provided"}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[var(--bg-card)] text-[var(--text-primary)] [border:var(--border-card)]">
                Requesting Admin Access
              </span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() =>
                  onApprove(user.id, user.display_name || user.email)
                }
                className="flex-1 inline-flex items-center justify-center [border:var(--border-good)] gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] text-[var(--text-primary)] hover:text-[var(--text-good)] rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <Check size={14} /> Approve
              </button>
              <button
                type="button"
                onClick={() => onDeny(user.id, user.display_name || user.email)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] text-[var(--text-primary)] hover:text-[var(--text-bad)] [border:var(--border-bad)] rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <X size={14} /> Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PendingRequests;

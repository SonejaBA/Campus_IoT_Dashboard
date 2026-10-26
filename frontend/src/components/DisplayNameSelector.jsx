import { useState, useEffect } from "react";
import { Tag } from "lucide-react";

function DisplayNameSelector({ displayName, onSetDisplayName }) {
  const [value, setValue] = useState(displayName || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(displayName || "");
  }, [displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSetDisplayName(value);
    } catch (error) {
      console.error("Failed to save display name:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl [border:var(--border-card)] bg-[var(--bg-card-strong)] p-4 gap-4"
    >
      <div className="flex flex-row items-center gap-3">
        <Tag size={21} className="shrink-0" />
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            Full Name
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Your display name.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. John Doe"
          className="rounded-lg bg-[var(--bg-card)] [border:var(--border-card)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[var(--bg-card)] [border:var(--border-card)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-opacity hover:opacity-90"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default DisplayNameSelector;

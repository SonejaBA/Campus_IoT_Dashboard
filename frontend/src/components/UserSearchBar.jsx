import { Search, X } from "lucide-react";

function UserSearchBar({ searchTerm, setSearchTerm }) {
    console.log(searchTerm)
  return (
    <div className="relative w-fit h-10 rounded-xl ml-auto bg-[var(--bg-card)] [border:var(--border-card)] text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-[var(--backdrop-blur)] z-[50]">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
      />

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
                    w-full
                    pl-9
                    pr-8
                    py-3
                    bg-[var(--control-bg)]
                    border-[color:var(--control-border)]
                    rounded-xl
                    text-xs
                    text-[var(--text-primary)]
                    placeholder-[var(--text-secondary)]
                    focus:outline-none
                    focus:ring-1
                    focus:ring-[var(--slider-focus)]
                    transition
                    "
      ></input>
      
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute right-2.5 cursor-pointer top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          title="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default UserSearchBar;

import { useState } from "react";
import UserSearchBar from "../components/UserSearchBar";

function Users() {
    const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex-1 text-[var(--text-primary)] p-10 flex flex-col gap-4">
      <h1 className="mb-3 hidden md:block">
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
      </h1>

      <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    </div>
  );
}

export default Users;

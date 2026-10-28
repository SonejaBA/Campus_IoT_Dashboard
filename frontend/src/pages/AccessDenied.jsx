import wordLogo from "../assets/wordLogo.png";

function AccessDenied() {
  return (
    <div className="m-20 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex flex-col">
        <div className="text-[var(--text-primary)]">
          <div className="text-9xl mb-4">:(</div>
          <h1 className="text-xl">You do not have access to that page.</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Contact an admin or request access directly here.
        </p>
        <button
          type="button"
          className="
            w-fit
            rounded-lg
            border
            border-[color:var(--control-border)] 
            bg-[var(--control-bg)]
            px-4 
            py-2.5 
            mt-2
            text-xs
            font-medium 
            text-[var(--control-text)] 
            transition 
            hover:bg-[var(--control-hover)]"
        >
          Request Access
        </button>
      </div>
      <img
        src={wordLogo}
        alt="Sacramento State Sustainability"
        className="mt-2 h-50 w-auto object-contain"
      />
    </div>
  );
}

export default AccessDenied;

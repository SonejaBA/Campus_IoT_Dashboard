import wordLogo from "../assets/wordLogo.png";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../components/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function AccessDenied() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [hasRequested, setHasRequested] = useState(false);

  if (role === "admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    async function checkExistingRequest() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("requested_access")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setHasRequested(!!data.requested_access);
        }
      } catch (err) {
        console.error("Error fetching access request status:", err);
      } finally {
        setFetchingStatus(false);
      }
    }

    checkExistingRequest();
  }, [user?.id]);

  const handleSubmitRequest = async () => {
    if (!user?.id) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ requested_access: true })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to submit request. Please try again.");
    } else {
      setHasRequested(true);
      toast.success("Access request submitted!", {
        description: "An admin has been notified and will review your request.",
      });
    }
  };

  return (
    <div className="m-15 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex flex-col items-start">
        <div className="text-[var(--text-primary)]">
          <div className="text-9xl mb-4">:(</div>
          <h1 className="text-xl">You do not have access to that page.</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Contact an admin or request access directly here.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            to="/"
            className="
            inline-flex
            gap-2
            justify-center
            items-center
            w-fit
            rounded-lg
            border
            border-[color:var(--control-border)] 
            bg-[var(--bg-card)]
            px-4 
            py-2.5 
            mt-2
            text-xs
            font-medium 
            text-[var(--control-text)] 
            transition 
            hover:bg-[var(--control-hover)]"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </Link>
          <button
            type="button"
            disabled={loading || hasRequested || fetchingStatus}
            onClick={() => handleSubmitRequest()}
            className="
            w-fit
            rounded-lg
            border
            border-[color:var(--control-border)] 
            bg-[var(--bg-card)]
            px-4 
            py-2.5 
            mt-2
            text-xs
            font-medium 
            text-[var(--control-text)] 
            transition 
            hover:bg-[var(--control-hover)]"
          >
            {fetchingStatus
              ? "Checking status..."
              : hasRequested
                ? "Request Pending"
                : loading
                  ? "Submitting..."
                  : "Request Admin Access"}
          </button>
        </div>
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

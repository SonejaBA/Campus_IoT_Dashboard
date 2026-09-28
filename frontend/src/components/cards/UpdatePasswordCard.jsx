import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import wordLogo from "../../assets/wordLogo.png";

function ErrorBanner({ errorMessage }) {
  let formattedErrorMessage = "";
  if (errorMessage === "New password should be different from the old password.") {
    formattedErrorMessage = "Please enter a new password different from your old one.";
  } else {
    formattedErrorMessage = errorMessage;
  }
  return <div className="text-red-400 text-sm mb-2">{formattedErrorMessage}</div>;
}

function UpdatePasswordCard() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const buttonText = loading ? "Updating..." : "Update password";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm p-8 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl text-white m-5">
      <div className="flex flex-col">
        <img src={wordLogo} className="h-20 object-contain" />
        <h2 className="text-3xl font-bold mb-6 text-center">Set New Password</h2>
        {error && <ErrorBanner errorMessage={error} />}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-white/90">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-emerald-200/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-white/40 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white/90">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-emerald-200/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-white/40 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-3 px-4 bg-emerald-200/10 hover:bg-emerald-400/25 border border-emerald-500/30 rounded-xl font-semibold transition duration-200 shadow-lg text-white cursor-pointer ${
            loading && "pointer-events-none bg-emerald-200/30"
          }`}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default UpdatePasswordCard;
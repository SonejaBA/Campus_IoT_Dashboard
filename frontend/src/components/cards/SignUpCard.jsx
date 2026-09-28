import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import wordLogo from "../../assets/wordLogo.png";

function ErrorBanner({ errorMessage }) {
  let formattedErrorMessage = "";
  if (errorMessage === "Failed to fetch") {
    formattedErrorMessage = "Check your internet connection.";
  } else {
    formattedErrorMessage = errorMessage;
  }
  return <div className="text-red-400">{formattedErrorMessage}</div>;
}

function SignUpCard() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const buttonText = loading ? "Signing up" : "Sign up";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmedPassword) {
      setError("Passwords do not match.");
      setPassword("");
      setConfirmedPassword("");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setEmail("");
      setPassword("");
      setConfirmedPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm p-8 bg-[#D3B577]/10 backdrop-blur-xl border border-[#D3B577]/60 rounded-2xl shadow-2xl text-white m-5">
      <div className="flex flex-col">
        <img src={wordLogo} className="h-20 object-contain" />
        <h2 className="text-3xl font-bold mb-6 text-center">Bin Tracker</h2>
        {error && <ErrorBanner errorMessage={error} />}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-white/90">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-[#D3B577]/10 border border-[#D3B577]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3B577]/50 text-white placeholder-white/40 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white/90">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#D3B577]/10 border border-[#D3B577]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3B577]/50 text-white placeholder-white/40 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1 text-white/90">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#D3B577]/10 border border-[#D3B577]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3B577]/50 text-white placeholder-white/40 transition"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-3 px-4 bg-[#D3B577]/10 hover:bg-[#D3B577]/25 border border-[#D3B577]/30 rounded-xl font-semibold transition duration-200 shadow-lg text-white cursor-pointer ${loading && "pointer-events-none bg-[#D3B577]/30"}`}
        >
          {buttonText}
        </button>
        <div className="flex justify-between">
          <Link
            to="/login"
            className="text-center text-sm text-white/80 hover:text-emerald-400 underline transition duration-200 mt-2"
          >
            Log in
          </Link>
          <Link
            to="/forgotpassword" 
            className="text-center text-sm text-white/80 hover:text-emerald-400 underline transition duration-200 mt-2">
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUpCard;

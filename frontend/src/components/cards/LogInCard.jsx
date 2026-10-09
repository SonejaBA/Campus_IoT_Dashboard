import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import wordLogo from "../../assets/wordLogo.png";


function ErrorBanner({ errorMessage }) {
  let formattedErrorMessage = "";
  if (errorMessage === "missing email or phone") {
    formattedErrorMessage = "Missing email or phone.";
  } else if (errorMessage === "Invalid login credentials") {
    formattedErrorMessage = "Invalid login credentials";
  } else {
    formattedErrorMessage = errorMessage;
  }
  return <div className="text-red-400">{formattedErrorMessage}</div>;
}

function LogInCard() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const buttonText = loading ? "Signing in" : "Sign in";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await logIn(email, password);
      navigate("/dashboard"); // Redirect to the dashboard after successful login
    } catch (err) {
      setError(err.message);
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm p-8 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl text-white m-5">
      <Link
        to="/"
        className="absolute top-8 left-8 text-sm text-white/80 hover:text-emerald-400 underline transition duration-200"
      >
        Home
      </Link>

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
            className="w-full px-4 py-3  bg-emerald-200/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-white/40 transition"
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
            className="w-full px-4 py-3 bg-emerald-200/10 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-white/40 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-3 px-4 bg-emerald-200/10 hover:bg-emerald-400/25 border border-emerald-500/30 rounded-xl font-semibold transition duration-200 shadow-lg text-white cursor-pointer ${loading && "pointer-events-none bg-emerald-200/30"}`}
        >
          {buttonText}
        </button>
        <div className="flex justify-between">
          <Link
            to="/signup"
            className="text-center text-sm text-white/80 hover:text-emerald-400 underline transition duration-200 mt-2"
          >
            Sign up
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

export default LogInCard;
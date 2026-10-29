import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileRole = async (userId) => {
    if (!userId) {
      setRole(null);
      setDisplayName("User");
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("role, display_name")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      setRole("viewer");
      setDisplayName("User");
    } else {
      setRole(data.role);
      setDisplayName(data.display_name);
    }

    
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfileRole(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileRole(currentUser.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;
    return data;
  };

  const logIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const forgotPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });

    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  };

  const logOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (displayName) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });

    if (error) throw error;

    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    role,
    isAdmin: role === "admin",
    signUp,
    logIn,
    forgotPassword,
    updatePassword,
    updateProfile,
    logOut,
    displayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

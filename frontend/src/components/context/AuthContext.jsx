import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

const AuthContext = createContext();

export default function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().
        then(({data: {session}, error}) => {
            //set user if data exists already. if not set it to null
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {

        setUser(session?.user ?? null);
        setLoading(false);
        });

        return () => {
        subscription.unsubscribe();
        };
    }, []);

    const signUp = async(email, password) => {
        const {data, error} = await supabase.auth.signUp({email, password});
        
        if (error) throw error; 
        return data;
    }

    const logIn = async(email, password) =>{
        const {data, error} = await supabase.auth.signInWithPassword({email, password});

        if (error) throw error; 
        return data;
    }

    const forgotPassword = async(email) =>{
        const {data, error} = await supabase.auth.resetPasswordForEmail(email);

        if (error) throw error; 
        return data;
    }


    const logOut = async() =>{
        await supabase.auth.signOut();
    }

    const value = {
        user,
        loading,
        signUp,
        logIn,
        forgotPassword,
        logOut
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
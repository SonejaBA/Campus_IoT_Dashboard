import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute ({children, allowedRoles}) {
    const { user, loading, role } = useAuth();

    if (loading){
        return null;
    }
    if (!user){
        return(
        <Navigate to="/login" replace/>
    )
    }

    if (allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/access-denied" replace />;
    }

    return(children)
}
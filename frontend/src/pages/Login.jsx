import LoginBackground from "../assets/loginBackground.jpg"
import { useState } from "react";

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

function Login(){
    return (
        //flex 1 since its going to be under a flex parent
        <div className="w-screen h-dvh bg-slate-700">
            <img src={LoginBackground} className="w-screen h-screen object-cover blur-xs scale-105 overflow-hidden"/>
        </div>
    )    
}

export default Login;
import { useState, useEffect } from 'react';
import { authFetch } from '../services/supabaseClient.js'

function useCheckHealth(){
    const [isHealthy,setIsHealthy] = useState(false)

    useEffect(() =>{
        authFetch(`${import.meta.env.VITE_API_URL}/api/health`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "online"){
                setIsHealthy(true)
            }
            else{
                setIsHealthy(false)
            }
        })
        .catch(error => {
                console.error("Server is completely unreachable:", error);
                setIsHealthy(false);
        });
    }, [])
    return isHealthy;
}

export {useCheckHealth}

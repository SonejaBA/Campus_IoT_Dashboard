import { useState, useEffect } from 'react';

function checkHealth(){
    const [isHealthy,setIsHealthy] = useState(false)

    useEffect(() =>{
        fetch('http://127.0.0.1:8000/api/health')
        .then(response => response.json())
        .then(data => {
            if (data.status === "online"){
                setIsHealthy(true)
            }
            else{
                setIsHealthy(false)
            }
        })
    }, [])
    return isHealthy;
}

export {checkHealth}
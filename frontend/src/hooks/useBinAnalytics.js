import { useState, useEffect } from 'react';

function useBinAnalytics(bin_id){
    const [binHistory, setBinHistory] = useState([]);

    useEffect(() =>{
        fetch(`${import.meta.env.VITE_API_URL}/api/analytics/${bin_id}`)
        .then(response => response.json())
        .then(data => setBinHistory(data))

    }, [bin_id]);

    return binHistory;
}

export { useBinAnalytics };

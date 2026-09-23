import { useState, useEffect } from 'react';

function useBinAnalytics(bin_id){
    const [binHistory, setBinHistory] = useState([]);

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/api/analytics/${bin_id}`)
        .then(response => response.json())
        .then(data => setBinHistory(data))

    }, [bin_id]);

    return binHistory;
}

export { useBinAnalytics };
import { useState, useEffect } from 'react';
//services
import { supabase } from '../services/supabaseClient.js'

function useBins(){
    const [bins, setBins] = useState([]);

    useEffect(() =>{
        fetch('http://127.0.0.1:8000/api/bins')
        .then(response => response.json())
        .then(data => setBins(data))

        const channel = supabase
        .channel('realtime_bins')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'bins' },
            (payload) => {
            setBins((prevBins) =>
                prevBins.map((bin) =>
                bin.id === payload.new.id ? { ...bin, ...payload.new } : bin
                )
            );
            }
        )
        .subscribe();

        return () => {
        supabase.removeChannel(channel);
        };
    }, []);

    return bins;
}

export { useBins };
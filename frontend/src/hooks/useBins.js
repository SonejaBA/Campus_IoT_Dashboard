import { useState, useEffect } from 'react';
//services
import { supabase } from '../services/supabaseClient.js'
import { authFetch } from '../services/supabaseClient.js'

function useBins(user){
    const [bins, setBins] = useState([]);

    useEffect(() =>{
        if(!user) {
            setBins([]);
            return;
        }    
        authFetch(`${import.meta.env.VITE_API_URL}/api/bins`)
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
    }, [user]);

    return bins;
}

export { useBins };

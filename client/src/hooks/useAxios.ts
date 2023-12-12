import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAxios(url: string, options: any) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await axios(url, options);
                setResponse(res.data);
                setIsLoading(false);
            } catch (error: any) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, options]);

    return { response, error, isLoading };
}

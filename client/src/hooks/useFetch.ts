import { useState, useEffect } from 'react';

export default function useFetch(url: string, options: object) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(url, options);
                const json = await res.json();
                setResponse(json);
                setIsLoading(false);
            } catch (error: any) {
                setError(error);
            }
        };
        fetchData();
    }, []);

    return { response, error, isLoading };
}
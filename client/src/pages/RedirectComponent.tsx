import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorRedirection from './ErrorRedirection';
import { UrlRetrieval } from '@/services/retrieveUrl.service';


const RedirectComponent = () => {
    const { shortUrl } = useParams<{ shortUrl: string }>();
    const [isError, setIsError] = useState(false);
    const hasRedirected = useRef(false);


    useEffect(() => {
        if (shortUrl && !hasRedirected.current) {
            UrlRetrieval(shortUrl)
                .then((response: string) => {
                    // Set the ref flag before redirecting to prevent double increment
                    hasRedirected.current = true;

                    // Redirect to the long URL
                    window.location.href = response;
                })
                .catch(() => {
                    setIsError(true);
                });
        }
    }, [shortUrl]);

    return (
        <div>
            {isError && <ErrorRedirection />}
        </div>
    );
};

export default RedirectComponent;

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorRedirection from './ErrorRedirection';
import { UrlRetrieval } from '@/services/retrieveUrl.service';


const RedirectComponent = () => {
    const { shortUrl } = useParams<{ shortUrl: string }>();
    const [isError, setIsError] = useState(false);
    const hasRedirected = useRef(false);


    const getReferrer = () => {
        const referrer = window.location.hostname.split('.').slice(-2).join('.');
        console.log('Referrer:', referrer);
        return referrer;
    }

    useEffect(() => {
        if (shortUrl && !hasRedirected.current) {

            const referrer = getReferrer();

            UrlRetrieval(shortUrl, referrer)
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

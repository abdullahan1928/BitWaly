import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorRedirection from './ErrorRedirection';
import UrlRetreival from '@/services/retrieveUrl.service';

const RedirectComponent = () => {
    const { shortUrl } = useParams<{ shortUrl: string }>();
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Example usage of the redirection function
        if (shortUrl) {
            UrlRetreival(shortUrl)
                .then((response) => {
                    window.location.href = response;
                }).catch(() => {
                    setIsError(true);
                });
        }
    }, [shortUrl]);

    return (
        <div>
            {isError ? (
                <ErrorRedirection />
            ) : (
                <p>

                </p>
            )}
        </div>
    );
};

export default RedirectComponent;

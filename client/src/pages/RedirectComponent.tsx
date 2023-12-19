// RedirectComponent.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { redirectToOriginalWebsite } from '@/utils/url.util';
import ErrorRedirection from './ErrorRedirection';
import UrlRetreival from '@/services/retrieveUrl';

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

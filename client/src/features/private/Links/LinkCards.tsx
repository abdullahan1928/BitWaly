import { getUserUrls } from "@/features/public/Home/services/url.service";
import { useEffect, useState } from "react";
import LinkCard from "./components/LinkCard";

interface Url {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    meta?: {
        title: string;
        image: string;
    };
}

const LinkCards = () => {
    const [userUrls, setUserUrls] = useState<Url[]>([]);
    const authToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserUrls = async () => {
            try {
                const urls = await getUserUrls(authToken);
                setUserUrls(urls);
            } catch (error) {
                console.error('Error fetching user URLs:', error);
            }
        };

        fetchUserUrls();
    }, [authToken]);

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const handleDeleteUrl = (deletedUrlId: string) => {
        setUserUrls(prevUrls => prevUrls.filter(url => url._id !== deletedUrlId));
    };

    return (
        <>
            {
                userUrls.length ? (
                    <div className="flex flex-col gap-4">
                        {userUrls.map(url => (
                            <LinkCard
                                key={url._id}
                                _id={url._id}
                                originalUrl={url.originalUrl}
                                shortUrl={url.shortUrl}
                                createdAt={formatCreatedAt(url.createdAt)}
                                meta={url.meta}
                                authToken={authToken}
                                onDeleteUrl={handleDeleteUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-center text-gray-800">
                        You have no URLs yet. Create one above!
                    </p>
                )
            }
        </>
    )
}

export default LinkCards
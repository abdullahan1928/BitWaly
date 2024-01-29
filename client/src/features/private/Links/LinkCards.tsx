import { useEffect, useState } from "react";
import LinkCard from "./components/LinkCard";
import { getUserUrls } from "@/features/public/Home/services/url.service";
import { useFilter } from "@/context/FilterLinksContext";

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
    const [filteredUserUrls, setFilteredUserUrls] = useState<Url[]>([]);
    const authToken = localStorage.getItem('token');
    const { linkTypeFilter, tagFilter } = useFilter();

    useEffect(() => {
        const fetchUserUrls = async () => {
            try {
                const urls = await getUserUrls(authToken);
                const sortedUrls = urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setUserUrls(sortedUrls);
            } catch (error) {
                console.error('Error fetching user URLs:', error);
            }
        };

        fetchUserUrls();
    }, [authToken, linkTypeFilter, tagFilter]);

    useEffect(() => {
        const filteredUrls = userUrls.filter((url: any) => {

            if (linkTypeFilter !== 'all' && url.isCustom !== (linkTypeFilter === 'custom')) {
                console.log(url.isCustom, linkTypeFilter, linkTypeFilter === 'custom');
                return false;
            }

            if (tagFilter.length > 0 && !tagFilter.every(tag => url.tags.includes(tag))) {
                return false;
            }

            return true;
        });

        setFilteredUserUrls(filteredUrls);
    }, [userUrls, linkTypeFilter, tagFilter]);

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const handleDeleteUrl = (deletedUrlId: string) => {
        setFilteredUserUrls(prevUrls => prevUrls.filter(url => url._id !== deletedUrlId));
    };

    return (
        <div className="flex flex-col gap-8">
            {filteredUserUrls.length > 0
                ? filteredUserUrls.map(url => (
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
                ))
                : <p className="text-xl text-center text-gray-600">
                    No links found.
                </p>
            }
        </div>
    );
}

export default LinkCards;

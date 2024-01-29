import { useEffect, useState } from "react";
import LinkCard from "./components/LinkCard";
import { getUserUrls } from "@/features/public/Home/services/url.service";
import { useFilter } from "@/context/FilterLinks";
import axios from "axios";
import { API_URL } from "@/config/config";

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
    const [tags, setTags] = useState<any>([]);

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

            if (tagFilter && tagFilter.length > 0) {
                console.log(url.tags, tagFilter);
                if (!url.tags || !url.tags.some((tag: string) => tagFilter.includes(tag))) {
                    return false;
                }
            }

            return true;
        });

        setFilteredUserUrls(filteredUrls);
    }, [userUrls, linkTypeFilter, tagFilter]);

    const getTags = async () => {
        axios.get(`${API_URL}/tag`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res: any) => {
            setTags(res);
            console.log(tags);
        }).catch((err: any) => {
            console.error(err);
        })
    }

    useEffect(() => {
        getTags();
    }, []);

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

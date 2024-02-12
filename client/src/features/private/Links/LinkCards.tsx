import { useEffect, useState } from "react";
import LinkCard from "./components/LinkCard";
import { getUserUrls } from "@/features/public/Home/services/url.service";
import { authToken } from "@/config/authToken";
import { useFilter } from "@/hooks/useFilter";

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
    const { linkTypeFilter, tagFilter, linkTypeFilterApplied, tagFilterApplied } = useFilter();

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
    }, [linkTypeFilter, tagFilter]);

    useEffect(() => {
        const filteredUrls = userUrls.filter((url: any) => {

            if (linkTypeFilter !== 'all' && url.isCustom !== (linkTypeFilter === 'custom')) {
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
                ? (
                    <>
                        <div className="flex font-bold">
                            <h3 className="text-2xl">
                                {`${(linkTypeFilterApplied || tagFilterApplied)
                                    ? 'Filtered:'
                                    : 'Total:'
                                    } 
                                    Links`
                                }
                            </h3>
                            <p className="ml-2 text-2xl">
                                {filteredUserUrls.length}
                            </p>
                        </div>

                        {filteredUserUrls.map(url => (
                            <LinkCard
                                key={url._id}
                                _id={url._id}
                                originalUrl={url.originalUrl}
                                shortUrl={url.shortUrl}
                                createdAt={formatCreatedAt(url.createdAt)}
                                meta={url.meta}
                                onDeleteUrl={handleDeleteUrl}
                                showDetails={true}
                            />
                        ))}
                        <div className="flex items-center justify-center gap-7">
                            <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                            <div className="text-lg text-center text-gray-400">
                                It's the end of the list!
                            </div>
                            <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                        </div>
                    </>
                )
                :
                <div className="flex items-center justify-center gap-2">
                    <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                    <div className="text-lg text-center text-gray-400">
                        No Links Found!
                    </div>
                    <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                </div>
            }
        </div>
    );

}

export default LinkCards;

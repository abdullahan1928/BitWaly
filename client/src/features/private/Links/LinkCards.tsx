import { useEffect, useState } from "react";
import LinkCard from "./components/LinkCard";
import { getUserUrls } from "@/features/public/Home/services/url.service";
import { useFilter } from "@/hooks/useFilter";
import { useSearch } from "@/hooks/useSearch";
import Skeleton from "@mui/material/Skeleton";
import { Pagination } from "@mui/material";

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
    const [loading, setLoading] = useState(true);
    const { linkTypeFilter, tagFilter, dateFilter, linkTypeFilterApplied, tagFilterApplied, dateFilterApplied } = useFilter();
    const { searchValue } = useSearch();
    const [currentPage, setCurrentPage] = useState(1);
    const [urlsPerPage] = useState(10);

    useEffect(() => {
        const authToken = localStorage.getItem("token");

        const fetchUserUrls = async () => {
            try {
                const urls = await getUserUrls(authToken);
                const sortedUrls = urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setUserUrls(sortedUrls);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user URLs:', error);
                setLoading(false);
            }
        };

        fetchUserUrls();
    }, []);

    useEffect(() => {
        const filteredUrls = userUrls.filter((url: any) => {

            if (linkTypeFilter !== 'all' && url.isCustom !== (linkTypeFilter === 'custom')) {
                return false;
            }

            if (tagFilter.length > 0 && !tagFilter.every(tag => url.tags.includes(tag))) {
                return false;
            }

            if (dateFilterApplied) {
                const createdAtDate = new Date(url.createdAt);
                const startDate = dateFilter[0] ? dateFilter[0].toDate() : null;
                const endDate = dateFilter[1] ? dateFilter[1].toDate() : null;

                if (startDate && createdAtDate < startDate) {
                    return false;
                }
                if (endDate && createdAtDate > endDate) {
                    return false;
                }
            }

            if (
                searchValue &&
                !url.originalUrl.toLowerCase().includes(searchValue.toLowerCase()) &&
                !url.shortUrl.toLowerCase().includes(searchValue.toLowerCase())
            ) {
                return false;
            }

            return true;
        });

        setFilteredUserUrls(filteredUrls);
    }, [userUrls, linkTypeFilter, tagFilter, searchValue, dateFilterApplied, dateFilter]);

    // Pagination logic
    const indexOfLastUrl = currentPage * urlsPerPage;
    const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
    const currentUrls = filteredUserUrls.slice(indexOfFirstUrl, indexOfLastUrl);

    const paginate = (_: React.ChangeEvent<unknown>, page: number) => setCurrentPage(page);

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const handleDeleteUrl = (deletedUrlId: string) => {
        setFilteredUserUrls(prevUrls => prevUrls.filter(url => url._id !== deletedUrlId));
    };

    return (
        <div className="flex flex-col gap-8">
            {loading ? (
                <>
                    <div className="flex items-center gap-4 font-bold">
                        <h3 className="text-2xl">
                            {`${(linkTypeFilterApplied || tagFilterApplied)
                                ? 'Filtered:'
                                : 'Total:'
                                } 
                            Links`
                            }
                        </h3>
                        <Skeleton variant="text" width={50} height={50} />
                    </div>
                    {[...Array(urlsPerPage)].map((_, index) => (
                        <div key={index}>
                            <Skeleton variant="rectangular" height={200} />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {currentUrls.length > 0 ? (
                        <>
                            <div className="flex font-bold">
                                <h3 className="text-2xl">
                                    {`${(linkTypeFilterApplied || tagFilterApplied)
                                        ? 'Filtered'
                                        : 'Total'
                                        } 
                                    Links:`
                                    }
                                </h3>
                                <p className="ml-2 text-2xl">
                                    {filteredUserUrls.length}
                                </p>
                            </div>

                            {currentUrls.map(url => (
                                <LinkCard
                                    key={url._id}
                                    _id={url._id}
                                    originalUrl={url.originalUrl}
                                    shortUrl={url.shortUrl}
                                    createdAt={formatCreatedAt(url.createdAt)}
                                    meta={url.meta}
                                    onDeleteUrl={handleDeleteUrl}
                                    isLinksPage={true}
                                />
                            ))}

                            <Pagination
                                className="mt-4 flex justify-end"
                                count={Math.ceil(filteredUserUrls.length / urlsPerPage)}
                                page={currentPage}
                                onChange={paginate}
                                color="primary"
                                shape="rounded"
                                showFirstButton
                                showLastButton
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                            <div className="text-lg text-center text-gray-400">
                                No Links Found!
                            </div>
                            <div className="w-20 border-b-[0.1rem] border-b-[#71809f]"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default LinkCards;

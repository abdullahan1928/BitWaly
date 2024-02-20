import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LinkBarChart from "@/features/private/LinkDetails/LinkBarChart";
import { UrlRetrievalById } from "@/services/retrieveUrl.service";
import LinkLocations from "@/features/private/LinkDetails/LinkLocations";
import LinkReferres from "@/features/private/LinkDetails/LinkReferres";
import LinkDevices from "@/features/private/LinkDetails/LinkDevices";
import DateRangeFilter from "@/components/DateRangeFilter";
import LinkCard from "@/features/private/Links/components/LinkCard";
import LinkSummary from "@/features/private/LinkDetails/LinkSummary";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { authToken } from "@/config/authToken";
import { DateFilterProvider } from "@/context/FilterLinkDetailsContext";

interface IUrl {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    meta?: {
        title: string;
        image: string;
    };
}

const LinkDetails = () => {
    const [urlData, setUrlData] = useState<IUrl | null>(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchLink();
    }, []);

    const fetchLink = async () => {
        try {
            const res = await UrlRetrievalById(authToken ?? '', id ?? '');
            setUrlData(res.url);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    return (
        <DateFilterProvider>
            <div className="container flex flex-col max-w-6xl gap-8 p-4 mx-auto">
                <Link to="/dashboard/links" className="flex items-center text-primary hover:underline">
                    <ChevronLeftIcon className='inline-block text-base' />
                    <p className='inline-block ml-2 text-base'>
                        Back to Links
                    </p>
                </Link>

                <LinkCard
                    _id={id ?? ''}
                    originalUrl={urlData?.originalUrl ?? ''}
                    shortUrl={urlData?.shortUrl ?? ''}
                    createdAt={urlData?.createdAt ?? ''}
                    meta={urlData?.meta}
                    onDeleteUrl={() => { }}
                    isLinksPage={false}
                    loading={loading}
                />

                <LinkSummary id={id ?? ''} />

                {urlData?.createdAt && (
                    <DateRangeFilter
                        createdAt={urlData.createdAt}
                        onDateChange={handleDateChange}
                    />
                )}

                {urlData?.createdAt && (
                    <LinkBarChart
                        id={id ?? ''}
                        createdAt={urlData?.createdAt ?? ''}
                    />
                )}

                <LinkLocations
                    id={id ?? ''}
                    startDate={startDate}
                    endDate={endDate}
                />

                <div className="flex flex-row flex-wrap gap-10 mb-4 max-lg:flex-col">
                    <LinkReferres id={id ?? ''} />

                    <LinkDevices id={id ?? ''} />
                </div>
            </div >
        </DateFilterProvider>
    );
};

export default LinkDetails;

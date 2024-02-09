import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LinkBarChart from "@/features/private/LinkDetails/LinkBarChart"
import { UrlRetrievalById } from "@/services/retrieveUrl.service"
import LinkLocations from "@/features/private/LinkDetails/LinkLocations";
import LinkReferres from "@/features/private/LinkDetails/LinkReferres";
import LinkDevices from "@/features/private/LinkDetails/LinkDevices";
import DateRangeFilter from "@/components/DateRangeFilter";
import LinkCard from "@/features/private/Links/components/LinkCard";
import LinkSummary from "@/features/private/LinkDetails/LinkSummary";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { authToken } from "@/config/authToken";

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

    const { id } = useParams<{ id: string }>()
    useEffect(() => {
        fetchLink();
    }, []);

    const fetchLink = async () => {
        UrlRetrievalById(authToken ?? '', id ?? '')
            .then((res) => {
                setUrlData(res.url)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    return (
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
                authToken={authToken ?? ''}
                onDeleteUrl={() => { }}
                showDetails={false}
            />

            <LinkSummary
                id={id ?? ''}
                authToken={authToken ?? ''}
            />

            {urlData?.createdAt && (
                <DateRangeFilter
                    createdAt={urlData.createdAt}
                    onDateChange={handleDateChange}
                />
            )}

            {urlData?.createdAt && (
                <LinkBarChart
                    id={id ?? ''}
                    authToken={authToken ?? ''}
                    createdAt={urlData?.createdAt ?? ''}
                // startDate={startDate}
                // endDate={endDate}
                />
            )}

            <LinkLocations
                id={id ?? ''}
                authToken={authToken ?? ''}
                startDate={startDate}
                endDate={endDate}
            />

            <div className="flex flex-row flex-wrap gap-10 mb-4">
                <LinkReferres />

                <LinkDevices id={id ?? ''} />
            </div>
        </div >
    )
}

export default LinkDetails
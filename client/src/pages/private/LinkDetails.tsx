import LinkCard from "@/features/private/Links/components/LinkCard"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LinkSummary from "@/features/private/LinkDetails/LinkSummary"
import LinkBarChart from "@/features/private/LinkDetails/LinkBarChart"
import { UrlRetrievalById } from "@/services/retrieveUrl.service"
import LinkLocations from "@/features/private/LinkDetails/LinkLocations";
import LinkReferres from "@/features/private/LinkDetails/LinkReferres";
import LinkDevices from "@/features/private/LinkDetails/LinkDevices";

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

    const { id } = useParams<{ id: string }>()
    const authToken = localStorage.getItem('token')

    useEffect(() => {
        fetchLink()
    }, [])

    const fetchLink = async () => {
        UrlRetrievalById(authToken ?? '', id ?? '')
            .then((res) => {
                setUrlData(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">

            <Link to="/dashboard/links" className="text-blue-500 hover:underline mb-8 flex items-center">
                <ChevronLeftIcon className='inline-block' />
                <p className='inline-block ml-2 text-lg'>
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

            <LinkBarChart />

            <LinkLocations />

            <div className="flex flex-row flex-wrap gap-10 mb-4">
                <LinkReferres />

                {id && (
                    <LinkDevices id={id} />
                )}
            </div>
        </div >
    )
}

export default LinkDetails
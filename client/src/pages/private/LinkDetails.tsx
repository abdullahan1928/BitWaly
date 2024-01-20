import { API_URL } from "@/config/config"
import LinkCard from "@/features/private/Links/components/LinkCard"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LinkSummary from "@/features/private/LinkDetails/LinkSummary"
import LinkBarChart from "@/features/private/LinkDetails/LinkBarChart"

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
        try {
            const response = await axios.get(`${API_URL}/url/retreive/id/${id}`, {
                headers: {
                    authToken: `${authToken}`
                }
            });
            if (response) {
                const data = await response.data;
                setUrlData(data)
            } else {
                console.error('Failed to fetch user URLs');
            }
        } catch (error) {
            console.log(error)
        }
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

            <LinkSummary />

            <LinkBarChart />

        </div >
    )
}

export default LinkDetails
import InsightsIcon from '@mui/icons-material/Insights';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material'; // Import Skeleton component from Material-UI
import { fetchClicks } from '@/services/analyticsSummary';
import { authToken } from '@/config/authToken';

const Performance = () => {
    const [clicksData, setClicksData] = useState<{ totalClicks: number; firstLinkDate: string } | null>(null);
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authToken !== null) {
                    const response = await fetchClicks(authToken);
                    setClicksData(response);
                    setLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error('Error fetching clicks data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchData();
    }, []);

    const formatDateString = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="flex flex-col w-full gap-4 text-gray-800 bg-white rounded-lg shadow-md">
            <h3 className="p-6 text-xl font-semibold font-proxima-nova">
                How your links are performing
            </h3>
            <div className="flex flex-col items-center gap-4 pb-4">
                {loading ? (
                    <>
                        <Skeleton variant="rectangular" width={300} height={50} animation="wave" />
                        <Skeleton variant="rectangular" width={300} height={30} animation="wave" />
                    </>
                ) : (
                    <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                        <InsightsIcon className="w-20 h-20" />
                        <p>{clicksData?.totalClicks} clicks + scans</p>
                    </span>
                )}
                {!loading && clicksData && (
                    <div>
                        <p>{formatDateString(clicksData.firstLinkDate)} - {formatDateString(new Date().toISOString())}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Performance;

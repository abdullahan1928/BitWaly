import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import InsightsIcon from '@mui/icons-material/Insights';
import { fetchTopLocationsWithAdmin } from '@/services/adminAnalytics.service';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchTopLocations } from '@/services/analyticsSummary.service';


const LocationSummary = () => {
    const [locationData, setLocationData] = useState<[string, number][]>([["", 0],]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        if (authToken === null) { return; }

        const fetchData = async () => {
            try {
                let response: any;

                if (id !== null && id !== undefined) {
                    response = await fetchTopLocationsWithAdmin(authToken, id);
                } else {
                    response = await fetchTopLocations(authToken);
                }

                setLocationData(response);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching location data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalyticsCard title="Top Cities across the Globe">
            <div className="flex flex-col items-center gap-2">
                {loading ? (
                    <>
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="flex flex-col items-center gap-2 pb-4">
                                <Skeleton variant="rectangular" width={300} height={40} animation="wave" />
                                <Skeleton variant="rectangular" width={300} height={20} animation="wave" />
                            </div>
                        ))}
                    </>
                ) : (
                    locationData.length > 0 ? (
                        locationData.map((cityData) => (
                            <div key={cityData[0]} className="flex flex-col items-center">
                                <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                                    <InsightsIcon className="w-20 h-20" />
                                    <p>{cityData[0]}</p>
                                </span>
                                <p>{cityData[1]} clicks + scans</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="mb-2 text-lg font-semibold">This data is currently not available.</p>
                        </div>
                    )
                )}
            </div>
        </AnalyticsCard>
    );
}

export default LocationSummary;

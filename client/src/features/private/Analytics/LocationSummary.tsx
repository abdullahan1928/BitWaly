import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import InsightsIcon from '@mui/icons-material/Insights';
import { fetchTopLocations } from '@/services/analyticsSummary';
import { authToken } from '@/config/authToken';
import { useEffect, useState } from 'react';

const LocationSummary = () => {
    const [locationData, setLocationData] = useState([["", 0],]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authToken) {
                    const response:any = await fetchTopLocations(authToken);
                    setLocationData(response.data);
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalyticsCard title="Top Cities across the Globe">
            <div className="flex flex-col items-center gap-4 pb-4">
                {locationData.length > 0 ? (
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
                        <p className="text-lg font-semibold mb-2">This data is currently not available.</p>
                    </div>
                )}
            </div>
        </AnalyticsCard>
    );
}

export default LocationSummary;

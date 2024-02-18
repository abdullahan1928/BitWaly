import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import InsightsIcon from '@mui/icons-material/Insights';

const LocationSummary = () => {
    return (
        <AnalyticsCard title="Clicks + scans over time">

            <div className="flex flex-col items-center gap-4 pb-4">
                <div className="flex flex-col items-center">
                    <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                        <InsightsIcon className="w-20 h-20" />
                        <p>United States</p>
                    </span>

                    <p>350 clicks + scans</p>
                </div>

                <hr className='w-2/3' />

                <div className="flex flex-col items-center">
                    <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                        <InsightsIcon className="w-20 h-20" />
                        <p>United Kingdom</p>
                    </span>

                    <p>205 clicks + scans</p>
                </div>

                <hr className='w-2/3' />

                <div className="flex flex-col items-center">
                    <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                        <InsightsIcon className="w-20 h-20" />
                        <p>New York</p>
                    </span>

                    <p>137 clicks + scans</p>
                </div>

                <p>Feb 12 - Feb 18, 2024</p>

            </div>

        </AnalyticsCard>
    )
}

export default LocationSummary
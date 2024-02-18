import InsightsIcon from '@mui/icons-material/Insights';

const Performance = () => {
    return (
        <div className="flex flex-col w-full gap-4 text-gray-800 bg-white rounded-lg shadow-md">

            <h3 className="p-6 text-xl font-semibold font-proxima-nova">
                Clicks + scans over time
            </h3>

            <div className="flex flex-col items-center gap-4 pb-4">
                <span className="flex flex-row items-center gap-2 text-2xl font-semibold font-proxima-nova">
                    <InsightsIcon className="w-20 h-20" />
                    <p>January 26, 2023</p>
                </span>

                <p>350 clicks + scans</p>

                <p>Oct 25, 2031 - Feb 16, 2024</p>
            </div>

        </div>
    )
}

export default Performance
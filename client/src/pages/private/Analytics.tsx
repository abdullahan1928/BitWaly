import Devices from "@/features/private/Analytics/Devices"
import HeatMap from "@/features/private/Analytics/HeatMap"
import LineChart from "@/features/private/Analytics/LineChart"
import Location from "@/features/private/Analytics/Location"
import LocationSummary from "@/features/private/Analytics/LocationSummary"
import Performance from "@/features/private/Analytics/Performance"
import Referrer from "@/features/private/Analytics/Referrer"

const Analytics = () => {
    return (
        <div className="flex flex-col w-full h-full gap-4">

            <h3 className="mb-8 text-3xl font-semibold font-proxima-nova">
                Analytics
            </h3>

            <div className="flex flex-row w-auto gap-4">
                <div className="flex flex-col w-1/2 gap-4">
                    <Performance />

                    <LineChart />

                    <LocationSummary />

                    <HeatMap />

                </div>

                <div className="flex flex-col w-1/2 gap-4">
                    <Devices />

                    <Referrer />

                    <Location />

                </div>
            </div>

        </div>
    )
}

export default Analytics
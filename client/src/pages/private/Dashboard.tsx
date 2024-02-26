import DashboardCards from "@/features/private/Dashboard/DashboardCards";
import GettingStarted from "@/features/private/Dashboard/GettingStarted";

const Dashboard = () => {
    return (
        <div className="container max-w-6xl px-4 mx-auto max-lg:px-0">

            <h2 className="mb-8 text-2xl font-bold max-md:text-3xl max-md:text-center">
                BitWaly : One and the only best link shortner
            </h2>

            <DashboardCards />

            <GettingStarted />

        </div>
    )
}

export default Dashboard

import Performance from "@/features/private/Analytics/Performance"

const Analytics = () => {
    return (
        <div className="flex flex-col w-full h-full gap-4">

            <h3 className="text-3xl font-semibold font-proxima-nova">
                Analytics
            </h3>

            <Performance />

        </div>
    )
}

export default Analytics
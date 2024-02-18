
interface AnalyticsCardProps {
    title: string;
    children: React.ReactNode;
}

const AnalyticsCard = ({ title, children }: AnalyticsCardProps) => {
    return (
        <div className="bg-white rounded-xl">
            <h3 className="p-6 text-xl font-semibold font-proxima-nova">
                {title}
            </h3>

            <div className="p-4">
                {children}
            </div>
        </div>
    )
}

export default AnalyticsCard
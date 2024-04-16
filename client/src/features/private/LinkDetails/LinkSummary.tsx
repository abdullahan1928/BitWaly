import { FetchClicks, FetchWeeklyCount, FetchWeeklyChange } from "@/services/fetchClicks.service";
import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";

interface SummaryItemProps {
    title: string;
    value: number | string;
    color: string;
    loading?: boolean;
}

const SummaryItem = ({ title, value, color, loading }: SummaryItemProps) => (
    <div className="flex items-center justify-between w-full px-8 py-4 m-0 bg-white rounded-lg max-sm:px-12 max-sm:py-6">
        <p className="text-xl text-[#526281] max-sm:text-3xl">{title}</p>
        {loading ? (
            <Skeleton variant="text" width={100} height={40} />
        ) : (
            <span className={`text-3xl font-bold max-sm:text-4xl ${color}`}>{value}</span>
        )}
    </div>
);

const LinkSummary = ({ id }: { id: string }) => {
    const [clicks, setClicks] = useState<number>(0);
    const [weeklyClicks, setWeekyClicks] = useState<number>(0);
    const [weeklyChange, setWeekyChange] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, [loading, id]);

    const getData = async () => {
        const authToken = localStorage.getItem('token');

        if (!authToken) return;

        const clickCount = await FetchClicks(authToken, id);
        setClicks(clickCount);
        const weeklyCount = await FetchWeeklyCount(authToken, id);
        setWeekyClicks(weeklyCount.clickData);
        const weeklyPerc = await FetchWeeklyChange(authToken, id);
        setWeekyChange(weeklyPerc.percentageChange);

        setLoading(false);
    };

    const summaryItems = [
        { title: 'Engagements', value: clicks, color: 'text-[#526281]' },
        { title: 'Last 7 days', value: weeklyClicks, color: 'text-[#526281]' },
        { title: 'Weekly change', value: `${weeklyChange}%`, color: weeklyChange >= 0 ? 'text-green-800' : 'text-red-500' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-10 max-lg:flex-wrap justify-evenly">
                {summaryItems.map((item, index) => (
                    <SummaryItem key={index} title={item.title} value={item.value} color={item.color} loading={loading} />
                ))}
            </div>
        </div>
    );
};

export default LinkSummary;

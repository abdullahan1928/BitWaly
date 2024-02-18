import { authToken } from "@/config/authToken";
import { FetchClicks, FetchWeeklyCount, FetchWeeklyChange } from "@/services/fetchClicks.service";
import { useEffect, useState } from "react";

interface SummaryItemProps {
    title: string;
    value: number | string;
    color: string;
}

const SummaryItem = ({ title, value, color }: SummaryItemProps) => (
    <div className="flex items-center justify-between w-full px-8 py-4 m-0 bg-white rounded-lg max-sm:px-12 max-sm:py-6">
        <p className="text-xl text-[#526281] max-sm:text-3xl">{title}</p>
        <span className={`text-3xl font-bold max-sm:text-4xl ${color}`}>{value}</span>
    </div>
);

const LinkSummary = ({ id }: { id: string }) => {
    const [clicks, setClicks] = useState<number>(0);
    const [weeklyClicks, setWeekyClicks] = useState<number>(0);
    const [weeklyChange, setWeekyChange] = useState<number>(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        if (!authToken) return;

        const clickCount = await FetchClicks(authToken, id);
        setClicks(clickCount);
        const weeklyCount = await FetchWeeklyCount(authToken, id);
        setWeekyClicks(weeklyCount.clickData);
        const weeklyPerc = await FetchWeeklyChange(authToken, id);
        setWeekyChange(weeklyPerc.percentageChange);
    };

    return (
        <div className="flex gap-10 max-lg:flex-wrap justify-evenly">
            <SummaryItem title="Engagements" value={clicks} color="text-[#526281]" />
            <SummaryItem title="Last 7 days" value={weeklyClicks} color="text-[#526281]" />
            <SummaryItem
                title="Weekly change"
                value={`${weeklyChange}%`}
                color={weeklyChange >= 0 ? 'text-green-800' : 'text-red-500'}
            />
        </div>
    );
};

export default LinkSummary;

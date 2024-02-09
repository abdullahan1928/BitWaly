import { authToken } from "@/config/authToken";
import { FetchClicks, FetchWeeklyCount, FetchWeeklyChange } from "@/services/fetchClicks.service";
import { useEffect, useState } from "react";

const LinkSummary = ({ id }: { id: string }) => {
    const [clicks, setClicks] = useState<number>(0);
    const [weeklyClicks, setWeekyClicks] = useState<number>(0);
    const [weeklyChange, setWeekyChange] = useState<number>(0);


    useEffect(() => {
        getData();
    }, [])



    const getData = async () => {
        if (!authToken) return;

        const clickCount = await FetchClicks(authToken, id);
        setClicks(clickCount);
        const weeklyCount = await FetchWeeklyCount(authToken, id);
        setWeekyClicks(weeklyCount.clickData)
        const weeklyPerc = await FetchWeeklyChange(authToken, id);
        setWeekyChange(weeklyPerc.percentageChange)

    }

    return (
        <div className="flex gap-10 justify-evenly">
            <div className="flex items-center justify-between w-full px-8 py-4 m-0 bg-white rounded-lg">
                <p className="text-xl text-[#526281]">
                    Engagements
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    {clicks}
                </span>
            </div>
            <div className="flex items-center justify-between w-full px-8 py-4 m-0 bg-white rounded-lg">
                <p className="text-xl text-[#526281]">
                    Last 7 days
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    {weeklyClicks}
                </span>
            </div>
            <div className="flex items-center justify-between w-full px-8 py-4 m-0 bg-white rounded-lg">
                <p className="text-xl text-[#526281]">

                    Weekly change
                </p>
                <span className={`text-3xl font-bold ${weeklyChange >= 0 ? 'text-green-800' : 'text-red-500'}`}>
                    {weeklyChange}%
                </span>
            </div>
        </div>
    )
}

export default LinkSummary
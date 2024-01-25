import { FetchClicks } from "@/services/fetchClicks.service";
import { useEffect, useState } from "react";

interface LinkSummaryProps {
    id: string;
    authToken: string;
}

const LinkSummary = ({ id, authToken }: LinkSummaryProps) => {
    const [clicks, setClicks] = useState<number>(0);

    useEffect(() => {
        getClicks();
    }, [])

    const getClicks = async () => {
        const res = await FetchClicks(authToken, id);
        setClicks(res);
    }

    return (
        <div className="flex gap-10 justify-evenly">
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">
                    Engagements
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    {clicks}
                </span>
            </div>
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">
                    Last 7 days
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    3
                </span>
            </div>
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">

                    Weekly change
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    100%
                </span>
            </div>
        </div>
    )
}

export default LinkSummary
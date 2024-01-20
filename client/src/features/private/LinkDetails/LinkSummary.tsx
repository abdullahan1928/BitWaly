import { API_URL } from "@/config/config";
import axios from "axios";
import { useEffect, useState } from "react";

interface LinkSummaryProps {
    id: string;
    authToken: string;
}

const LinkSummary = ({ id, authToken }: LinkSummaryProps) => {
    const [clicks, setClicks] = useState<number>(0);

    useEffect(() => {
        fetchClicks()
    }, [])

    const fetchClicks = async () => {
        try {
            const response = await axios.get(`${API_URL}/analytics/clicks/${id}`, {
                headers: {
                    authToken: `${authToken}`
                }
            });
            if (response) {
                const data = await response.data[0].clicks;
                setClicks(data)
            } else {
                console.error('Failed to fetch user URLs');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex gap-10 my-8 justify-evenly">
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
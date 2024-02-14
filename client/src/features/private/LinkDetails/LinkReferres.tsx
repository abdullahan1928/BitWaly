import { authToken } from '@/config/authToken';
import { API_URL } from '@/config/urls';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PieChart from './components/PieChart';

const LinkReferres = ({ id }: { id: string }) => {
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([]);
    const [totalEngagements, setTotalEngagements] = useState<number>(0);

    useEffect(() => {
        axios.get(`${API_URL}/analytics/referrer/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res) => {
            const data: { [key: string]: string } = res.data;
            const countMap: { [key: string]: number } = {};
            let total = 0;

            Object.values(data).forEach((value) => {
                countMap[value] = (countMap[value] || 0) + 1;
                total++;
            });

            const chartDataArray = Object.keys(countMap).map((key) => {
                return {
                    name: `
                    <div>
                        <div style="color: #666666">${key}</div>&nbsp;&nbsp;&nbsp;
                        <div style="color: #666666;">${countMap[key]}</div>
                    </div>
                    `,
                    y: countMap[key]
                };
            });

            setChartData(chartDataArray);
            setTotalEngagements(total);
        }).catch((err) => {
            console.log(err);
        });
    }, [id]);

    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%]">

            <PieChart
                title="Referrers"
                chartData={chartData}
                setChartData={setChartData}
                totalEngagements={totalEngagements}
                setTotalEngagements={setTotalEngagements}
            />

        </div>
    );
}

export default LinkReferres;

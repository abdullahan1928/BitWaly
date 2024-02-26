import { API_URL } from '@/config/urls';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PieChart from './components/PieChart';

const LinkDevices = ({ id }: { id: string }) => {
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([]);
    const [totalDevices, setTotalDevices] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        axios.get(`${API_URL}/analytics/device/${id}`, {
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
            setTotalDevices(total);

            setLoading(false);
        }).catch((err) => {
            console.log(err);
        });
    }, [id]);

    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%] max-lg:w-full">

            <h3 className="text-xl font-semibold text-center">
                Devices
            </h3>

            <PieChart
                title="Devices"
                chartData={chartData}
                setChartData={setChartData}
                totalEngagements={totalDevices}
                setTotalEngagements={setTotalDevices}
                loading={loading}
            />

        </div>
    )
}

export default LinkDevices
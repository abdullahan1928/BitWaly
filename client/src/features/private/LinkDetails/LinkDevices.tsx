import { API_URL } from '@/config/urls';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PieChart from './components/PieChart';
import { useDateFilter } from '@/hooks/useDateFilter';

interface IDeviceData {
    device: string;
    date: string;
}

const LinkDevices = ({ id }: { id: string }) => {
    const [deviceData, setDeviceData] = useState<IDeviceData[]>([]);
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([]);
    const [totalDevices, setTotalDevices] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const { startDate, endDate } = useDateFilter();

    const showData = (data: IDeviceData[]) => {
        let total = 0;

        const countMap: { [key: string]: number } = {};

        Object.values(data).forEach((value) => {
            countMap[value.device] = (countMap[value.device] || 0) + 1;
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
    }

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        axios.get(`${API_URL}/analytics/device/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res) => {
            const data: IDeviceData[] = res.data;

            setDeviceData(data);
            showData(data);

        }).catch((err) => {
            console.log(err);
        });
    }, [id]);

    const updateData = (start: Date, end: Date) => {
        const filteredData = deviceData.filter((data) => {
            const date = new Date(data.date);
            return date >= start && date <= end;
        });

        showData(filteredData);
    }

    useEffect(() => {
        updateData(startDate, endDate);
    }, [startDate, endDate]);

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
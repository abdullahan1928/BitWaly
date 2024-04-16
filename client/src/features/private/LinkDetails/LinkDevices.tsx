import { API_URL } from '@/config/urls';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PieChart from './components/PieChart';
import { useDateFilter } from '@/hooks/useDateFilter';
import { CircularProgress } from '@mui/material';

interface IDeviceData {
    device: string;
    date: string;
}

const LinkDevices = ({ id }: { id: string }) => {
    const [deviceData, setDeviceData] = useState<IDeviceData[]>([]);
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([]);
    const [totalDevices, setTotalDevices] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(true);

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

            setIsEmpty(data.length === 0);

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

            {isEmpty ? (
                <div className="flex flex-col gap-4 p-4 relative">
                    <CircularProgress variant="determinate" value={100} size={300} sx={{ color: '#E3E3E3' }} />

                    <div className='absolute flex flex-col items-center justify-center p-4 w-full h-full top-0 left-0 bg-white bg-opacity-80 rounded-md'>
                        <p className="absolute text-2xl font-bold text-center text-gray-500">
                            No data for this time period.
                            <span className="block mt-2 font-normal text-lg text-gray-500">
                                <br />
                                Share your link to get engagements and view link stats.
                            </span>
                        </p>
                    </div>
                </div>
            ) : (
                <PieChart
                    title="Devices"
                    chartData={chartData}
                    setChartData={setChartData}
                    totalEngagements={totalDevices}
                    setTotalEngagements={setTotalDevices}
                    loading={loading}
                />
            )}

        </div>
    )
}

export default LinkDevices
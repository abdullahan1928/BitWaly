import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchClicksWithDates } from '@/services/analyticsSummary';
import { useEffect, useState } from 'react';
import { authToken } from '@/config/authToken';

const LineChart = () => {
    interface ClickData {
        date: string;
        clicks: number;
    }
    const [chartData, setChartData] = useState<ClickData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authToken !== null) {
                    const response = await fetchClicksWithDates(authToken);
    
                    // Check if response and response.data are defined
                    if (response && response.data) {
                        const clickData: ClickData[] = response.data;
                        setChartData(clickData);
                    } else {
                        console.error('Invalid response structure:', response);
                    }
                }
            } catch (error) {
                console.error('Error fetching click data:', error);
            }
        };
    
        fetchData();
    }, []);
    

    const options = {
        title: {
            text: '',
        },
        chart: {
            height: 300,
        },
        xAxis: {
            categories: chartData.map(dataPoint => dataPoint.date),
        },
        yAxis: {
            title: {
                text: '',
            },
        },
        series: [
            {
                name: 'Clicks',
                data: chartData.map(dataPoint => dataPoint.clicks),
                color: '#E33E7F',
                showInLegend: false,
            },
        ],
    };

    return (
        <AnalyticsCard title='Clicks + scans over time'>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </AnalyticsCard>
    );
};

export default LineChart;

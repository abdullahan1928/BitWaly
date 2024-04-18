import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Skeleton } from '@mui/material';
import { fetchClicksWithDatesWithAdmin } from '@/services/adminAnalytics.service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClicksWithDates } from '@/services/analyticsSummary.service';

const LineChart = () => {
    interface ClickData {
        date: string;
        clicks: number;
    }
    const [chartData, setChartData] = useState<ClickData[]>([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        if (authToken === null) { return; }

        const fetchData = async () => {
            try {
                let response: any;

                if (id !== null && id !== undefined) {
                    response = await fetchClicksWithDatesWithAdmin(authToken, id);
                }
                else {
                    response = await fetchClicksWithDates(authToken);
                }

                // Check if response and response.data are defined
                if (response) {
                    const clickData: ClickData[] = response;
                    setChartData(clickData);
                    setLoading(false); // Set loading to false after data is fetched
                } else {
                    console.error('Invalid response structure:', response);
                    setLoading(false); // Set loading to false in case of invalid response
                }

            } catch (error) {
                console.error('Error fetching click data:', error);
                setLoading(false); // Set loading to false in case of error
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
            {loading ? (
                <Skeleton variant="rectangular" height={300} animation="wave" />
            ) : (
                <HighchartsReact highcharts={Highcharts} options={options} />
            )}
        </AnalyticsCard>
    );
};

export default LineChart;

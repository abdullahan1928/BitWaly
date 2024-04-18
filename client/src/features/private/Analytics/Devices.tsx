import { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import { fetchDevicesWithAdmin } from '@/services/adminAnalytics.service';
import { Skeleton } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchDevices } from '@/services/analyticsSummary.service';

const Devices = () => {
    const [subtitle, setSubtitle] = useState<string>('');
    const [hoveredData, setHoveredData] = useState<{ name: string; percentage: number; engangement: number } | null>(null);
    const [chartData, setChartData] = useState<{ name: string; y: number; color?: string }[]>([]);
    const [totalEngagements, setTotalEngagements] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        if (authToken === null) { return; }

        const fetchData = async () => {
            try {
                let response: any;

                if (id !== null && id !== undefined) {
                    response = await fetchDevicesWithAdmin(authToken, id);
                } else {
                    response = await fetchDevices(authToken);
                }

                const data = response.map((deviceData: any) => ({
                    name: deviceData.device,
                    y: deviceData.count,
                }));

                setChartData(() => {
                    const updatedChartData = data.map((dataItem: any) => ({
                        ...dataItem,
                    }));
                    return updatedChartData;
                });

                const total = data.reduce((acc: any, dataItem: any) => acc + dataItem.y, 0);
                setTotalEngagements(total);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching device data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [hoveredData]);

    useEffect(() => {
        if (hoveredData !== null) {
            const updatedChartData = chartData.map((dataItem) => ({
                ...dataItem,
                color: dataItem.name === hoveredData.name ? '#E33E7F' : '#CCCCCC'
            }));
            setChartData(updatedChartData);
        } else {
            const updatedChartData = chartData.map((dataItem) => ({
                ...dataItem,
                color: undefined
            }));
            setChartData(updatedChartData);
        }
    }, [hoveredData]);

    useEffect(() => {
        if (hoveredData) {
            const percentage = (hoveredData.engangement / totalEngagements) * 100;
            setSubtitle(`
                <div style="font-size: 32px; color: #666666;font-weight: 600;text-align: center;">
                    ${percentage.toFixed(2)}%
                </div>
            `);
        } else {
            setSubtitle(`
                <div style="color: #666666;text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;font-weight: 600;">
                        ${totalEngagements}
                    </div>
                    <div style="font-size: 14px;">
                        Engagements
                    </div>
                </div>
            `);
        }
    }, [totalEngagements, hoveredData]);

    return (
        <AnalyticsCard title='Clicks & scans by Devices'>
            {loading ? (
                <div className='flex items-center justify-center pt-10'>
                    <Skeleton
                        variant="circular"
                        width={300}
                        height={300}
                    />
                </div>
            ) : (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        title: {
                            text: '',
                        },
                        subtitle: {
                            useHTML: true,
                            text: subtitle,
                            floating: true,
                            align: 'center',
                            verticalAlign: 'middle',
                            x: -60,
                            y: 30,
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false,
                                },
                                showInLegend: true,
                                point: {
                                    events: {
                                        mouseOver: function (this: any) {
                                            const percentage = (this.y / totalEngagements) * 100;
                                            setHoveredData({
                                                name: this.name,
                                                engangement: this.y,
                                                percentage: percentage,
                                            });
                                        },
                                        mouseOut: function () {
                                            setHoveredData(null);
                                        },
                                        legendItemClick: function (this: any) {
                                            if (this.visible) {
                                                setTotalEngagements((prevTotal) => {
                                                    const newTotal = prevTotal - this.y;
                                                    return newTotal;
                                                });
                                            } else {
                                                setTotalEngagements((prevTotal) => {
                                                    const newTotal = prevTotal + this.y;
                                                    return newTotal;
                                                });
                                            }
                                        },
                                    },
                                },
                            },
                        },
                        tooltip: {
                            formatter: function (this: any) {
                                return `<b>${this.point.name}</b>: ${((this.point.y / totalEngagements) * 100).toFixed(2)}%`;
                            },
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            itemMarginBottom: 10,
                            itemStyle: {
                                fontSize: '14px',
                                fontWeight: 'normal',
                                color: '#666666',
                            },
                            symbol: 'circle',
                            sybmoPadding: 10,
                        },
                        exporting: {
                            enabled: true,
                        },
                        series: [
                            {
                                type: 'pie',
                                name: '',
                                innerSize: '80%',
                                data: chartData,
                            },
                        ],
                        chart: {
                            height: 300,
                        },
                    }}
                />
            )}
        </AnalyticsCard>
    );
};

export default Devices;

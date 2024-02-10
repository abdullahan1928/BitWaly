import { authToken } from '@/config/authToken';
import { API_URL } from '@/config/urls';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

const LinkReferres = ({ id }: { id: string }) => {
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([]);
    const [totalEngagements, setTotalEngagements] = useState<number>(0);
    const [hoveredData, setHoveredData] = useState<{ name: string; percentage: number } | null>(null);

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
    }, []);

    useEffect(() => {
        // Update the colors of chartData based on hoveredData
        if (hoveredData !== null) {
            const updatedChartData = chartData.map((dataItem) => ({
                ...dataItem,
                color: dataItem.name === hoveredData.name ? '#E33E7F' : '#CCCCCC'
            }));
            setChartData(updatedChartData);
        } else {
            // Reset colors if no part is hovered over
            const updatedChartData = chartData.map((dataItem) => ({
                ...dataItem,
                color: undefined
            }));
            setChartData(updatedChartData);
        }
    }, [hoveredData]);

    const formatSubtitle = () => {
        if (hoveredData) {
            return `<div style="font-size: 32px; color: #666666;font-weight: 600;text-align: center;">
            ${hoveredData.percentage.toFixed(2)}%
            </div>`;
        } else {
            return `
                <div style="color: #666666;text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;font-weight: 600;">
                    ${totalEngagements}
                    </div>
                    <div style="font-size: 14px;">
                    Engagements
                    </div>
                </div>
            `;
        }
    };

    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%]">
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: 'Referrers',
                    },
                    subtitle: {
                        useHTML: true,
                        text: formatSubtitle(),
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
                                enabled: false
                            },
                            showInLegend: true,
                            point: {
                                events: {
                                    mouseOver: function (this: any) {
                                        const percentage = (this.y / totalEngagements) * 100;
                                        setHoveredData({
                                            name: this.name,
                                            percentage: percentage
                                        });
                                    },
                                    mouseOut: function () {
                                        setHoveredData(null);
                                    }
                                }
                            }
                        },
                    },
                    tooltip: {
                        formatter: function (this: any) {
                            return `<b>${this.point.name}</b>: ${((this.point.y / totalEngagements) * 100).toFixed(2)}%`;
                        }
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'middle',
                        layout: 'vertical',
                        itemMarginBottom: 10,
                        itemStyle: {
                            fontSize: '14px',
                            fontWeight: 'normal',
                            color: '#666666'
                        },
                        symbol: 'circle',
                        sybmoPadding: 10,
                    },
                    series: [{
                        type: 'pie',
                        name: 'Referrers',
                        innerSize: '80%',
                        data: chartData,
                    }]
                }}
            />
        </div>
    );
}

export default LinkReferres;

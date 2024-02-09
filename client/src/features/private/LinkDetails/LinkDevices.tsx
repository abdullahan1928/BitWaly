import { authToken } from '@/config/authToken';
import { API_URL } from '@/config/urls';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

const LinkDevices = ({ id }: { id: string }) => {
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([])

    // const data = 81.41

    useEffect(() => {
        axios.get(`${API_URL}/analytics/device/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res) => {
            const data: { [key: string]: string } = res.data; // Specify the type of 'data'
            const countMap: { [key: string]: number } = {}; // Specify the type of 'countMap'

            Object.values(data).forEach((value) => {
                countMap[value] = (countMap[value] || 0) + 1;
            });

            const chartDataArray = Object.keys(countMap).map((key) => {
                if (key === 'browser') {
                    return {
                        name: 'Desktop',
                        y: countMap[key]
                    };
                }
                return {
                    name: key,
                    y: countMap[key]
                };
            });

            setChartData(chartDataArray);
        }).catch((err) => {
            console.log(err);
        });
    }, []);


    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%]">
            {/* <h3 className="mb-4 text-xl font-bold">
                Devices
            </h3> */}


            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: 'Devices',
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
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
                        symbolRadius: 0,
                        symbolHeight: 14,
                        symbolWidth: 14,
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        innerSize: '80%',
                        data: chartData,
                        // data: [{
                        //     name: 'Chrome',
                        //     y: data,
                        // },
                        // {
                        //     name: 'Firefox',
                        //     y: 10,
                        // },
                        // {
                        //     name: 'Edge',
                        //     y: 5,
                        // },
                        // {
                        //     name: 'Safari',
                        //     y: 5,
                        // },
                        // {
                        //     name: 'Other',
                        //     y: 5,
                        // }
                        // ]
                    }]
                }}
            />


        </div>
    )
}

export default LinkDevices
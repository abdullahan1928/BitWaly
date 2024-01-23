import { API_URL } from '@/config/config';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

const LinkDevices = ({ id }: { id: string }) => {
    const [chartData, setChartData] = useState<{ name: string; y: number }[]>([])

    // const data = 81.41

    useEffect(() => {
        const authToken = localStorage.getItem('token')
        axios.get(`${API_URL}/analytics/browser/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res) => {
            const data = res.data as { [key: string]: number }
            const chartData = Object.keys(data).map((key) => {
                return {
                    name: key,
                    y: data[key]
                }
            })
            setChartData(chartData)

        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%]">
            {/* <h3 className="text-xl font-bold mb-4">
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
                    }]
                }}
            />


        </div>
    )
}

export default LinkDevices
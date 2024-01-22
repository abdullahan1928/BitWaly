import { API_URL } from '@/config/config';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect } from 'react';

const LinkDevices = ({ id }: { id: string }) => {

    const data = 81.41

    useEffect(() => {
        const authToken = localStorage.getItem('token')
        axios.get(`${API_URL}/analytics/browser/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res) => {
            console.log(res.data)
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
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false
                            },
                            borderWidth: 0
                        }
                    },
                    series: [
                        {
                            name: 'Referrers',
                            type: 'pie',
                            innerSize: '80%',
                            data: [data, 100 + 51 - data, 51, 51, 51, 51],
                        },
                    ],
                }}
            />


        </div>
    )
}

export default LinkDevices
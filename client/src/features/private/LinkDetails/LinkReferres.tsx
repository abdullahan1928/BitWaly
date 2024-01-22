import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LinkReferres = () => {
    return (
        <div className="bg-white rounded-md shadow-md p-4 w-[48%]">
            {/* <h3 className="text-xl font-bold mb-4">
                Referrers
            </h3> */}

            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: 'Referrers'
                    },
                    chart: {
                        type: 'pie',
                        height: 500,
                    },
                    series: [
                        {
                            name: 'Referrers',
                            data: [
                                {
                                    name: 'Google',
                                    y: 61.41,
                                    sliced: true,
                                    selected: true,
                                },
                                {
                                    name: 'Facebook',
                                    y: 11.84,
                                },
                                {
                                    name: 'Instagram',
                                    y: 10.85,
                                },
                                {
                                    name: 'Twitter',
                                    y: 4.67,
                                },
                                {
                                    name: 'Youtube',
                                    y: 4.18,
                                },
                                {
                                    name: 'Others',
                                    y: 7.05,
                                },
                            ],
                        },
                    ],
                }}
            />

        </div>
    )
}

export default LinkReferres
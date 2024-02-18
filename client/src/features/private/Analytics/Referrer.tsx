import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import AnalyticsCard from "@/features/private/Analytics/AnalyticsCard";

const Referrer = () => {

    const chartData = [
        { name: 'LinkedIn', y: 54 },
        { name: 'Twitter', y: 25 },
        { name: 'Facebook', y: 43 },
        { name: 'Instagram', y: 54 },
        { name: 'Pinterest', y: 73 },
        { name: 'YouTube', y: 12 },
        { name: 'Direct', y: 7 },
        { name: 'Others', y: 47 }
    ];

    return (
        <AnalyticsCard title="Clicks + scans by referrer">

            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        type: 'column',
                        height: 300,
                    },
                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: chartData.map((data) => data.name),
                        crosshair: true,
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                        },
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat:
                            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y} engagements</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true,
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.001,
                        },
                    },
                    series: [
                        {
                            name: 'Referrer',
                            data: chartData,
                            color: '#E33E7F',
                            showInLegend: false,
                        },
                    ],
                }}
            />
        </AnalyticsCard>
    )
}

export default Referrer
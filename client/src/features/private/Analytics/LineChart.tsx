import AnalyticsCard from '@/features/private/Analytics/AnalyticsCard';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
    const generateData = () => {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push(Math.floor(Math.random() * 50));
        }
        return data;
    };

    const options = {
        title: {
            text: '',
        },
        chart: {
            height: 300,
        },
        xAxis: {
            categories: ['01/30', '01/31', '02/01', '02/02', '02/03', '02/04', '02/05', '02/06', '02/07', '02/08', '02/09', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '02/21', '02/22', '02/23', '02/24', '02/25', '02/26', '02/27', '02/28']
        },
        yAxis: {
            title: {
                text: '',
            },
        },
        series: [
            {
                name: 'Data',
                data: generateData(),
                color: '#E33E7F',
                showInLegend: false
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

import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addWeeks } from 'date-fns';
import { fetchEngagement } from '@/services/engagementsWDates'

interface LinkBarChartProps {
    id: string;
    authToken: string;
    createdAt: string;
    startDate: Date;
    endDate: Date;
  }
  
  const LinkBarChart = ({ id, authToken, createdAt, startDate, endDate }: LinkBarChartProps) => {
    const [chartData, setChartData] = useState<{
      categories: string[];
      data: number[];
    }>({
      categories: [],
      data: [],
    });
  
    const minStartDate = new Date(createdAt);
    const maxEndDate = new Date();
  
    useEffect(() => {
        fetchEngagement(authToken, id)
        .then((res) => {
          const categories = res.map((data:any) => data.date);
          const data = res.map((data:any) => data.clicks);

          console.log(categories)
  
          setChartData({
            categories,
            data,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }, [id, authToken]);
  
    useEffect(() => {
      updateChartData(minStartDate, maxEndDate);
    }, []);
  
    useEffect(() => {
      updateChartData(startDate, endDate);
    }, [startDate, endDate]);
  
    const updateChartData = (start: Date, end: Date) => {
      const datesInRange = [];
      let currentDate = new Date(start);
  
      while (currentDate <= end) {
        datesInRange.push(format(currentDate, 'dd/MM/yyyy'));
        currentDate = addWeeks(currentDate, 1);
      }
  
      if (format(currentDate, 'dd/MM/yyyy') !== format(end, 'dd/MM/yyyy')) {
        datesInRange.push(format(end, 'dd/MM/yyyy'));
      }
  
    };

    return (
        <div className='flex flex-col gap-4'>
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Engagements over time',
                    },
                    xAxis: {
                        categories: chartData.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Engagements'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat:
                            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y} engagements</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                        }
                    },
                    series: [{
                        name: 'Link Clicks',
                        data: chartData.data,
                        color: '#E33E7F'
                    }]
                }}
            />
        </div>
    );
};

export default LinkBarChart;

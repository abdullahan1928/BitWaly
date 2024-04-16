import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { fetchEngagement } from '@/services/engagementsWDates.service';
import BarChartSkeleton from './LinkBarSkelton';
import { useDateFilter } from '@/hooks/useDateFilter';

interface ChartData {
  categories: string[];
  data: number[];
}

const LinkBarChart = ({ id }: { id: string; }) => {
  const [originalChartData, setOriginalChartData] = useState<ChartData>({ categories: [], data: [] });
  const [selectedChartData, setSelectedChartData] = useState<ChartData>({ categories: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  const { startDate, endDate } = useDateFilter();

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (!authToken) return;

    fetchEngagement(authToken, id)
      .then((res) => {
        const updatedData = res.map((data: any) => ({
          date: format(new Date(data.date), 'dd/MM/yyyy'),
          clicks: data.clicks,
        }));

        const chartData = {
          categories: updatedData.map((data: any) => data.date),
          data: updatedData.map((data: any) => data.clicks),
        };

        setOriginalChartData(chartData);
        setSelectedChartData(chartData);

        setLoading(false);
        setIsEmpty(updatedData.length === 0);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const updateChartData = (start: Date, end: Date) => {

    const formattedDates = originalChartData.categories.map((date: string) => {
      const [day, month, year] = date.split('/');
      return new Date(`${month}/${day}/${year}`);
    });

    const filteredCategories = originalChartData.categories.filter((_: string, index: number) => {
      const currentDate = formattedDates[index];
      const isInDateRange = currentDate >= start && currentDate <= end;
      return isInDateRange;
    });

    const filteredData = originalChartData.data.filter((_: number, index: number) => {
      const currentDate = formattedDates[index];
      const isInDateRange = currentDate >= start && currentDate <= end;
      return isInDateRange;
    });

    setSelectedChartData({
      categories: filteredCategories,
      data: filteredData,
    });
  }

  useEffect(() => {
    updateChartData(startDate, endDate);
  }, [startDate, endDate]);


  return (
    <div className="flex flex-col gap-4">
      <div className='bg-white rounded-xl'>

        <h3 className="my-4 text-xl font-semibold text-center">
          Engagements over time
        </h3>

        {loading ? (
          <BarChartSkeleton barCount={7} width={80} />
        ) : (
          isEmpty ? (
            <div className="flex flex-col gap-4 p-4 relative">
              <BarChartSkeleton animation={false} barCount={20} width={40} />

              <div className="absolute flex flex-col items-center justify-center p-4 w-full h-full top-0 left-0 bg-white bg-opacity-70 rounded-md">
                <p className="absolute text-2xl font-bold text-center text-gray-500">
                  No engagements found for the selected date range.
                  <span className="block text-lg text-gray-500 font-medium">
                    <br />
                    Share your link to get engagements.
                  </span>
                </p>
              </div>

            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: 'column',
                },
                title: {
                  text: '',
                },
                xAxis: {
                  categories: selectedChartData.categories,
                  crosshair: true,
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: 'Engagements',
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
                    pointPadding: 0.2,
                  },
                },
                series: [
                  {
                    name: 'Link Clicks',
                    data: selectedChartData.data,
                    color: '#E33E7F',
                  },
                ],
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default LinkBarChart;

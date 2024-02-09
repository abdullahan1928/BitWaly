import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { fetchEngagement } from '@/services/engagementsWDates';
import DatePicker from 'react-datepicker';
import { authToken } from '@/config/authToken';

interface LinkBarChartProps {
  id: string;
  createdAt: string;
}

const LinkBarChart = ({ id, createdAt }: LinkBarChartProps) => {
  const [originalChartData, setOriginalChartData] = useState<{
    categories: string[];
    data: number[];
  }>({
    categories: [],
    data: [],
  });

  const [selectedChartData, setSelectedChartData] = useState<{
    categories: string[];
    data: number[];
  }>({
    categories: [],
    data: [],
  });

  const [startDate, setStartDate] = useState(new Date(createdAt));
  const [endDate, setEndDate] = useState(new Date());

  const minStartDate = new Date(createdAt);

  useEffect(() => {
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
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id, authToken]);

  useEffect(() => {
    updateChartData(minStartDate, new Date());
  }, []);

  useEffect(() => {
    updateChartData(startDate, endDate);
  }, [startDate, endDate]);

  const updateChartData = (start: Date, end: Date) => {
    console.log('Updating chart data...');

    const formattedDates = originalChartData.categories.map((date: string) => {
      // Assuming the date format is 'DD/MM/YYYY'
      const [day, month, year] = date.split('/');
      return new Date(`${month}/${day}/${year}`);
    });
    console.log('Formatted Dates:', formattedDates);

    const filteredCategories = originalChartData.categories.filter((date: string, index: number) => {
      const currentDate = formattedDates[index];
      const isInDateRange = currentDate >= start && currentDate <= end;
      console.log('Original Date:', date, 'Formatted Date:', currentDate, 'Is in Date Range:', isInDateRange);
      return isInDateRange;
    });

    const filteredData = originalChartData.data.filter((clicks: number, index: number) => {
      const currentDate = formattedDates[index];
      const isInDateRange = currentDate >= start && currentDate <= end;
      console.log('Original Clicks:', clicks, 'Is in Date Range:', isInDateRange);
      return isInDateRange;
    });

    console.log('Filtered Categories:', filteredCategories);
    console.log('Filtered Data:', filteredData);

    setSelectedChartData({
      categories: filteredCategories,
      data: filteredData,
    });
  };





  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date as Date);
            updateChartData(date as Date, endDate);
          }}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <div className="flex gap-2">
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date as Date);
            updateChartData(startDate, date as Date);
          }}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          chart: {
            type: 'column',
          },
          title: {
            text: 'Engagements over time',
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
    </div>
  );
};

export default LinkBarChart;

import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addWeeks } from 'date-fns';
import EastIcon from '@mui/icons-material/East';

const LinkBarChart = ({ createdAt }: { createdAt: string }) => {
    const [startDate, setStartDate] = useState(new Date(createdAt));
    const [endDate, setEndDate] = useState(new Date());
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
        updateChartData(minStartDate, maxEndDate);
    }, []);

    const handleDateChange = (selectedDate: Date, dateType: 'start' | 'end') => {
        if (dateType === 'start') {
            setStartDate(selectedDate);
            updateChartData(selectedDate, endDate);
        } else {
            setEndDate(selectedDate);
            updateChartData(startDate, selectedDate);
        }
    };

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

        setChartData({
            categories: datesInRange,
            data: Array.from({ length: datesInRange.length }, () => Math.floor(Math.random() * 100)),
        });
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex items-center justify-start gap-2">
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => handleDateChange(date, 'start')}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minStartDate}
                    maxDate={maxEndDate}
                    dateFormat="dd/MM/yyyy"
                    className='p-2 border border-gray-300 rounded-md'
                />
                <EastIcon className='w-6 h-6 text-gray-400' />
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => handleDateChange(date, 'end')}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minStartDate}
                    maxDate={maxEndDate}
                    dateFormat="dd/MM/yyyy"
                    className='p-2 border border-gray-300 rounded-md'
                />
            </div>
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

import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addWeeks } from 'date-fns';

const LinkBarChart = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addWeeks(new Date(), 1));
    const [chartData, setChartData] = useState<{
        categories: string[];
        data: number[];
    }>({
        categories: [],
        data: [],
    });

    useEffect(() => {
        updateChartData(startDate, endDate);
    }, []); 

    const handleDateChange = (selectedDate: Date, dateType: 'start' | 'end') => {
        if (dateType === 'start') {
            setStartDate(selectedDate);
            // setEndDate(addWeeks(selectedDate, 1)); // Set end date to one week ahead
        } else {
            setEndDate(selectedDate);
        }

        // Update chart data based on selected date range
        updateChartData(selectedDate, endDate);
    };

    const updateChartData = (start: Date, end: Date) => {
        const datesInRange = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            datesInRange.push(format(currentDate, 'dd/MM/yyyy'));
            currentDate = addWeeks(currentDate, 1);
        }

        setChartData({
            categories: datesInRange,
            data: Array.from({ length: datesInRange.length }, () => Math.floor(Math.random() * 100)),
        });
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex justify-start gap-2 items-center">
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => handleDateChange(date, 'start')}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    className='border border-gray-300 rounded-md px-2 py-1'
                />
                <span> to </span>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => handleDateChange(date, 'end')}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    className='border border-gray-300 rounded-md px-2 py-1'
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
                        name: 'Engagements',
                        data: chartData.data,
                        color: '#526281'
                    }]
                }}
            />
        </div>
    );
};

export default LinkBarChart;

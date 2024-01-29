import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, addWeeks } from 'date-fns';
import EastIcon from '@mui/icons-material/East';

interface DateRangeFilterProps {
    createdAt: string;
    onDateChange: (startDate: Date, endDate: Date) => void;
}

const DateRangeFilter = ({ createdAt, onDateChange }: DateRangeFilterProps) => {
    const [startDate, setStartDate] = useState(new Date(createdAt));
    const [endDate, setEndDate] = useState(new Date());

    const minStartDate = new Date(createdAt);
    const maxEndDate = new Date();

    const handleDateChange = (selectedDate: Date, dateType: 'start' | 'end') => {
        if (dateType === 'start') {
            setStartDate(selectedDate);
            updateData(selectedDate, endDate);
        } else {
            setEndDate(selectedDate);
            updateData(startDate, selectedDate);
        }
    };

    const updateData = (start: Date, end: Date) => {
        const datesInRange = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            datesInRange.push(format(currentDate, 'dd/MM/yyyy'));
            currentDate = addWeeks(currentDate, 1);
        }

        if (format(currentDate, 'dd/MM/yyyy') !== format(end, 'dd/MM/yyyy')) {
            datesInRange.push(format(end, 'dd/MM/yyyy'));
        }

        onDateChange(start, end);
    };

    return (
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
    )
}

export default DateRangeFilter
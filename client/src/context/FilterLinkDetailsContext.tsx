import { ReactNode, createContext, useState } from 'react';

interface DateFilterContextProps {
    startDate: Date;
    endDate: Date;
    updateDates: (newStartDate: Date, newEndDate: Date) => void;
}

export const DateFilterContext = createContext({} as DateFilterContextProps);

export const DateFilterProvider = ({ children }: { children: ReactNode }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const updateDates = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    return (
        <DateFilterContext.Provider value={{ startDate, endDate, updateDates }}>
            {children}
        </DateFilterContext.Provider>
    );
};

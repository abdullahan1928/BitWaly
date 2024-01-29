import { createContext, useContext, useState } from 'react';

const DateFilterContext = createContext({
    startDate: new Date(),
    endDate: new Date(),
    updateDates: (newStartDate: Date, newEndDate: Date) => {
        console.log(newStartDate, newEndDate);
    },
});

export const DateFilterProvider = ({ children }: { children: React.ReactNode }) => {
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

export const useDateFilter = () => {
    return useContext(DateFilterContext);
};

import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { ReactNode, createContext, useState } from 'react';

interface FilterContextProps {
    linkTypeFilter: string;
    tagFilter: string[];
    dateFilter: DateRange<Dayjs>;
    linkTypeFilterApplied: boolean;
    tagFilterApplied: boolean;
    dateFilterApplied: boolean;
    setLinkTypeFilter: (filter: string) => void;
    setTagFilter: (filter: string[]) => void;
    setDateFilter: (filter: DateRange<Dayjs>) => void;
    setLinkTypeFiltersApplied: (filter: boolean) => void;
    setTagFilterApplied: (filter: boolean) => void;
    setDateFilterApplied: (filter: boolean) => void;
}

export const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [linkTypeFilter, setLinkTypeFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<DateRange<Dayjs>>([null, null]);
    const [linkTypeFilterApplied, setLinkTypeFiltersApplied] = useState(false);
    const [tagFilterApplied, setTagFilterApplied] = useState(false);
    const [dateFilterApplied, setDateFilterApplied] = useState(false);

    return (
        <FilterContext.Provider value={{
            linkTypeFilter,
            tagFilter,
            dateFilter,
            linkTypeFilterApplied,
            tagFilterApplied,
            dateFilterApplied,
            setLinkTypeFilter,
            setTagFilter,
            setDateFilter,
            setLinkTypeFiltersApplied,
            setTagFilterApplied,
            setDateFilterApplied
        }}>
            {children}
        </FilterContext.Provider>
    );
};
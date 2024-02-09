import { ReactNode, createContext, useState } from 'react';

interface FilterContextProps {
    linkTypeFilter: string;
    tagFilter: string[];
    setLinkTypeFilter: (filter: string) => void;
    setTagFilter: (filter: string[]) => void;
    linkTypeFilterApplied: boolean;
    setLinkTypeFiltersApplied: (filter: boolean) => void;
    tagFilterApplied: boolean;
    setTagFilterApplied: (filter: boolean) => void;
}

export const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [linkTypeFilter, setLinkTypeFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [linkTypeFilterApplied, setLinkTypeFiltersApplied] = useState(false);
    const [tagFilterApplied, setTagFilterApplied] = useState(false);

    return (
        <FilterContext.Provider value={{ linkTypeFilter, tagFilter, setLinkTypeFilter, setTagFilter, linkTypeFilterApplied, setLinkTypeFiltersApplied, tagFilterApplied, setTagFilterApplied }}>
            {children}
        </FilterContext.Provider>
    );
};



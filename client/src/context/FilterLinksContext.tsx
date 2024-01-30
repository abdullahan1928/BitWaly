import React, { createContext, useContext, useState } from 'react';

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

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

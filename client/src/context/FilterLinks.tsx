import React, { createContext, useContext, useState } from 'react';

interface FilterContextProps {
    linkTypeFilter: string;
    tagFilter: string[];
    setLinkTypeFilter: (filter: string) => void;
    setTagFilter: (filter: string[]) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [linkTypeFilter, setLinkTypeFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState<string[]>([]);

    return (
        <FilterContext.Provider value={{ linkTypeFilter, tagFilter, setLinkTypeFilter, setTagFilter }}>
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

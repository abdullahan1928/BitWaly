import { ReactNode, createContext, useState } from 'react';

interface SearchContextProps {
    searchValue: string;
    setSearch: (value: string) => void;
    clearSearch: () => void;
}

export const SearchContext = createContext({} as SearchContextProps);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchValue, setSearchValue] = useState('');

    const setSearch = (value: string) => {
        setSearchValue(value);
    };

    const clearSearch = () => {
        setSearchValue('');
    };

    return (
        <SearchContext.Provider value={{ searchValue, setSearch, clearSearch }}>
            {children}
        </SearchContext.Provider>
    );
};


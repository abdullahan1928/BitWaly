import { ReactNode, createContext, useState } from 'react';

interface SearchContextProps {
    searchValue: string;
    setSearch: (value: string) => void;
    clearSearch: () => void;
    searchActive: boolean;
    setSearchActive: (value: boolean) => void;
}

export const SearchContext = createContext({} as SearchContextProps);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    const setSearch = (value: string) => {
        setSearchValue(value);
    };

    const clearSearch = () => {
        setSearchValue('');
    };

    return (
        <SearchContext.Provider value={{ searchValue, setSearch, clearSearch, searchActive, setSearchActive }}>
            {children}
        </SearchContext.Provider>
    );
};


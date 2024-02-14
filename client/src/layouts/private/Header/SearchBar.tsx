import { IconButton, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearch } from '@/hooks/useSearch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const { searchValue, setSearch, clearSearch } = useSearch();
    const [search, setSearchValue] = useState("");

    const navigate = useNavigate();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };


    const handleClearSearch = () => {
        setSearchValue("");
        clearSearch();
    };

    const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearch(search);
            navigate('/dashboard/links');
        }
    };

    return (
        <TextField
            variant="outlined"
            size="small"
            value={search}
            placeholder="Search..."
            onChange={handleSearchChange}
            onKeyUp={handleSearchKeyPress}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton size="small">
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        {searchValue && (
                            <IconButton size="small" onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
            sx={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                width: "30rem",
            }}
        />
    )
}

export default SearchBar
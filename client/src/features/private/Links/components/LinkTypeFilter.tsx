import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

interface LinkTypeFilterProps {
    linkType: string;
    handleLinkChange: (event: any) => void;
    filterApplied: boolean;
}

const LinkTypeFilter = ({ linkType, handleLinkChange, filterApplied }: LinkTypeFilterProps) => {
    return (
        <FormControl sx={{
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: filterApplied ? 'primary.main' : 'none',
                },
                '&:hover fieldset': {
                    borderColor: filterApplied ? 'primary.main' : 'none',
                },
                '&.Mui-focused fieldset': {
                    borderColor: filterApplied ? 'primary.main' : 'none',
                },
            },
        }}>
            <InputLabel>
                Link Type
            </InputLabel>
            <Select
                value={linkType}
                label="Link Type"
                onChange={handleLinkChange}
            >
                <MenuItem value='all'>
                    All
                </MenuItem>
                <MenuItem value='custom'>
                    Link With Custom back-halves
                </MenuItem>
                <MenuItem value='not-custom'>
                    Link Without Custom back-halves
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default LinkTypeFilter
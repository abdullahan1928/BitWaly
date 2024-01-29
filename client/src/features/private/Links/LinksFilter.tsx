import ChipsInput from "@/components/ChipsInput";
import PrimaryButton from "@/components/PrimaryButton";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useFilter } from '@/context/FilterLinks';
import { useState } from "react";

const LinksFilter = () => {
    const [linkType, setLinkType] = useState('all');
    const [tags, setTags] = useState<string[]>([]);
    const { setLinkTypeFilter, setTagFilter } = useFilter();

    const handleLinkChange = (event: SelectChangeEvent<string>) => {
        setLinkType(event.target.value)
    }

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
    }

    const applyFilters = () => {
        setLinkTypeFilter(linkType);
        setTagFilter(tags);
    }

    const clearFilters = () => {
        setLinkTypeFilter('all');
        setTagFilter([]);
        setLinkType('all');
        setTags([]);
    }

    return (
        <div className="flex gap-4 mb-4">
            <FormControl sx={{ m: 0, minWidth: 300 }}>
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

            <ChipsInput
                tags={tags}
                onTagChange={handleTagChange}
                className="w-96"
            />

            <button
                className="px-4 py-2 text-base bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={clearFilters}
            >
                Clear Filters
            </button>

            <PrimaryButton
                text="Apply Filters"
                className="p-4 m-0 text-base"
                onClick={applyFilters}
            />
        </div>
    );
};

export default LinksFilter;

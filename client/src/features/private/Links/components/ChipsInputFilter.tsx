import { API_URL } from '@/config/urls';
import { Autocomplete, Chip, TextField } from '@mui/material';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useFilter } from '@/hooks/useFilter';

interface Tag {
    _id: string;
    name: string;
}

interface ChipsInputProps {
    tags: string[];
    onTagChange: (newTags: string[]) => void;
    className?: string;
    filterApplied?: boolean;
}

const ChipsInputFilter = ({ tags, onTagChange, className, filterApplied }: ChipsInputProps) => {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const { tagFilter, setTagFilter } = useFilter();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useEffect(() => {
        getAllTags();
        const tagsSelected = allTags.filter((tag: any) => tagFilter.includes(tag._id)) || allTags.filter((tag: any) => tags.includes(tag._id));
        setSelectedTags(tagsSelected);
    }, [tagFilter, tags])

    const getAllTags = () => {
        const authToken = localStorage.getItem('token');

        axios.get(`${API_URL}/tag`,
            {
                headers: {
                    authToken: `${authToken}`
                }
            })
            .then((res) => {
                setAllTags(res.data);
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleTagChange = (_: SyntheticEvent<Element, Event>, value: (string | Tag)[]) => {
        onTagChange(value.map((tag: any) => tag._id));
        setTagFilter(value.map((tag: any) => tag._id));
    }

    const handleRenderTags = (value: Tag[], props: any) => {
        return value.map((option, index) => (
            <Chip key={index} label={option.name} {...props({ index })} />
        ));
    }

    const handleRenderInput = (params: any) => {
        return (
            <TextField
                {...params}
                label="Add Tags"
                sx={{
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
                }}
            />
        )
    }

    return (
        <Autocomplete
            clearIcon={false}
            options={allTags}
            getOptionLabel={(option: any) => option.name}
            freeSolo
            multiple
            value={selectedTags}
            onChange={handleTagChange}
            renderTags={handleRenderTags}
            renderInput={handleRenderInput}
            renderOption={(props, option, { selected }) => (
                <li {...props} key={option._id} className="flex flex-row items-center justify-between px-4 py-2">
                    <span key={option._id}>
                        {option.name}
                    </span>
                    {selected ?
                        <DoneIcon className='text-green-700' />
                        : null}
                </li>
            )}
            className={className}
        />
    );
}

export default ChipsInputFilter;

import { API_URL } from '@/config/config';
import { Autocomplete, Chip, TextField } from '@mui/material';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useFilter } from '@/context/FilterLinksContext';

interface Tag {
    _id: string;
    name: string;
}

interface ChipsInputProps {
    tags: string[];
    onTagChange: (newTags: string[]) => void;
    className?: string;
}

const ChipsInputFilter = ({ tags, onTagChange, className }: ChipsInputProps) => {
    const [allTags, setAllTags] = useState<Tag[]>([]);

    const { tagFilter, setTagFilter } = useFilter();

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
            />
        )
    }

    const getAllTags = () => {
        const authToken = localStorage.getItem('token')
        axios.get(`${API_URL}/tag`,
            {
                headers: {
                    authToken: `${authToken}`
                }
            })
            .then((res) => {
                setAllTags(res.data);
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        getAllTags()
    }, [])

    const selectedTags = allTags.filter(tag => tagFilter.includes(tag._id)) || allTags.filter(tag => tags.includes(tag._id));

    return (
        <div>
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
        </div>
    );
}

export default ChipsInputFilter;

import { API_URL } from '@/config/urls';
import { Autocomplete, Chip, TextField } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';

interface ChipsInputProps {
    tags: string[];
    onTagChange: (newTags: string[]) => void;
    className?: string; 
}

const ChipsInput = ({ tags, onTagChange, className }: ChipsInputProps) => {
    const [allTags, setAllTags] = useState<string[]>([])

    const handleTagChange = (_: any, newValue: string[]) => {
        onTagChange(newValue)
    }

    const handleRenderTags = (value: string[], props: any) => {
        return value.map((option, index) => (
            <Chip label={option} {...props({ index })} />
        ))
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
                const tagsArray = res.data.map((tag: any) => tag.name)
                setAllTags(tagsArray)
            }).catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        getAllTags()
    }, [])

    return (
        <div>
            <Autocomplete
                clearIcon={false}
                options={allTags}
                freeSolo
                multiple
                value={tags}
                onChange={handleTagChange}
                renderTags={handleRenderTags}
                renderInput={handleRenderInput}
                renderOption={(props, option, { selected }) => (
                    <li {...props} key={option} className="flex flex-row items-center justify-between px-4 py-2">
                        <span>
                            {option}
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

export default ChipsInput
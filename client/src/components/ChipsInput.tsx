import { Autocomplete, Chip, TextField } from '@mui/material'

const ChipsInput = () => {
    return (
        <div>
            <Autocomplete
                clearIcon={false}
                options={[]}
                freeSolo
                multiple
                renderTags={(value, props) =>
                    value.map((option, index) => (
                        <Chip label={option} {...props({ index })} />
                    ))
                }
                renderInput={(params) => <TextField label="Add Tags" {...params} />}
            />
        </div>
    )
}

export default ChipsInput
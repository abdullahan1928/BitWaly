import PrimaryButton from '@/components/PrimaryButton'
import { TextField } from '@mui/material'
import React, { useState } from 'react'

const DisplayName = () => {
    const [name, setName] = useState("")

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-xl font-medium">
                Display Name
            </h4>

            <TextField
                type="text"
                value={name}
                onChange={handleNameChange}
                autoComplete='off'
                sx={{
                    marginBottom: '0.5rem'
                }}
            />

            <PrimaryButton
                text="Update Display Name"
                className="w-1/6 py-3 px-0 text-lg"
                disabled={name === ""}
            />
        </div>
    )
}

export default DisplayName
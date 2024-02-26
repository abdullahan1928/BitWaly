import PrimaryButton from '@/components/PrimaryButton'
import { API_URL } from '@/config/urls'
import { TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DisplayName = () => {
    const [name, setName] = useState("")

    useEffect(() => {
        const authToken = localStorage.getItem('token')

        axios.get(`${API_URL}/auth/getUser`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then(res => {
            setName(res.data.name)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleSubmit = () => {
        const authToken = localStorage.getItem('token')

        axios.put(`${API_URL}/auth/name`,
            {
                name: name
            },
            {
                headers: {
                    authToken: `${authToken}`
                }
            }
        ).then(res => {
            console.log(res.data)
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
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
                className="w-1/6 px-0 py-3 text-lg"
                disabled={name === ""}
                onClick={handleSubmit}
            />
        </div>
    )
}

export default DisplayName
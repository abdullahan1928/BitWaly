import { Snackbar } from '@mui/material'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface IProps {
    text: string
    message?: string
    className?: string
}

const CopyToClipboardButton = (props: IProps) => {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        setOpen(true)
        navigator.clipboard.writeText(props.text)
    }

    return (
        <>
            <ContentCopyIcon
                className={`text-gray-500 hover:text-gray-700 cursor-pointer hover:scale-110 ${props.className}`}
                onClick={handleClick} />
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message={props.message || 'Copied to clipboard'}
            />
        </>
    )
}

export default CopyToClipboardButton
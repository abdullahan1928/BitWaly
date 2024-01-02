import { Snackbar } from '@mui/material'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface IProps {
    text: string
    message?: string
}

const CopyToClipboardButton = (props: IProps) => {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        setOpen(true)
        navigator.clipboard.writeText(props.text)
    }

    return (
        <>
            <ContentCopyIcon className='hover:cursor-pointer' onClick={handleClick} />
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
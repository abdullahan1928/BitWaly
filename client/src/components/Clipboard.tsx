import { Snackbar, Tooltip } from '@mui/material'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { twMerge } from 'tailwind-merge';

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
            <Tooltip title="Copy">
                <ContentCopyIcon
                    className={twMerge(
                        'text-gray-500 hover:text-gray-700 cursor-pointer hover:scale-110',
                        props.className
                    )}
                    onClick={handleClick}
                />
            </Tooltip>
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
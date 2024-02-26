import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface DeleteDialogProps {
    heading: string;
    body: string;
    deleteDialogOpen: boolean;
    closeDeleteDialog: () => void;
    handleDelete: () => void;
}

const DeleteDialog = (props: DeleteDialogProps) => {

    return (    
        <>
            <Dialog
                open={props.deleteDialogOpen}
                onClose={props.closeDeleteDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        maxWidth: '30rem',
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    '& .MuiTypography-root': {
                        fontWeight: 'bold',
                    }
                }}>
                    <Typography variant="h5">
                        {props.heading}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div dangerouslySetInnerHTML={{ __html: props.body }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={props.handleDelete}
                        color="error"
                        autoFocus
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteDialog
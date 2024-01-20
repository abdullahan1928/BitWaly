import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface DeleteDialogProps {
    deleteDialogOpen: boolean;
    closeDeleteDialog: () => void;
    handleDelete: () => void;
}

const DeleteDialog = (
    { deleteDialogOpen, closeDeleteDialog, handleDelete }: DeleteDialogProps
) => {

    return (
        <>
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
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
                    <Typography variant="h5">Delete Link?</Typography>
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this URL?
                    <br />
                    This cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
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
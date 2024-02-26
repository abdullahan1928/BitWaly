import DeleteDialog from '@/components/DeleteDialog'
import PrimaryButton from '@/components/PrimaryButton'
import { API_URL } from '@/config/urls'
import axios from 'axios'
import { useState } from 'react'

const DeleteAccount = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
    }

    const handleDelete = () => {
        const authToken = localStorage.getItem('token')

        axios.delete(`${API_URL}/auth/`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res: any) => {
            console.log(res);
            closeDeleteDialog()
            localStorage.removeItem('token')
            window.location.href = '/'
        }).catch((err: any) => {
            console.error(err);
        })
    }

    return (
        <div className="flex flex-col gap-4 mb-4">
            <h3 className="text-xl font-medium">
                Delete Account
            </h3>

            <p className="text-gray-500">
                This will permanently delete your account and all of your data and links.
            </p>

            <PrimaryButton
                text="Delete Account"
                className="w-1/6 px-0 py-3 text-lg bg-red-600 hover:bg-red-700"
                onClick={() => setDeleteDialogOpen(true)}
            />

            <DeleteDialog
                heading="Delete Account"
                body="Are you sure you want to delete your account? 
                <br/>
                This will permanently delete your account and all of your data and links."
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                handleDelete={handleDelete}
            />

        </div>
    )
}

export default DeleteAccount
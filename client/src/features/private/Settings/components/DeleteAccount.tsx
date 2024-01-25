import PrimaryButton from '@/components/PrimaryButton'

const DeleteAccount = () => {
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
                className="w-1/6 py-3 px-0 text-lg bg-red-600 hover:bg-red-700"
            />
        </div>
    )
}

export default DeleteAccount
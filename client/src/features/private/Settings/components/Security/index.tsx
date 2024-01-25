import ChangePassword from './ChangePassword'

const Security = () => {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium">
                Security & authentication
            </h3>

            <ChangePassword />

        </div>
    )
}

export default Security
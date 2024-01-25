import PrimaryButton from "@/components/PrimaryButton"
import { TextField } from "@mui/material"
import { useState } from "react"

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit')
    }

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-xl font-medium">
                Change password
            </h4>

            <p className="text-gray-500">
                You will be required to login after changing your password
            </p>

            <div className="flex flex-col gap-4 mb-2">
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Current password</span>
                    <TextField
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete='off'
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-medium">New password</span>
                    <TextField
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-medium">Confirm new password</span>
                    <TextField
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
            </div>

            <PrimaryButton
                text="Change password"
                className="w-1/6 py-3 px-0 text-lg"
                onClick={handleSubmit}
                disabled={currentPassword === "" || newPassword === "" || confirmNewPassword === ""}
            />

        </div>
    )
}

export default ChangePassword
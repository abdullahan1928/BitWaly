//component to change user password
import CustomSnackbar from "@/components/CustomSnackbar";
import PrimaryButton from "@/components/PrimaryButton";
import { API_URL } from "@/config/urls";
import { Alert, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordsMatch, setNewPasswordsMatch] = useState(true);
    const [passwordChanged, setPasswordChanged] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword === confirmNewPassword) {
            setNewPasswordsMatch(true);
        } else {
            setNewPasswordsMatch(false);
        }

        if (currentPassword === newPassword) {
            setPasswordChanged(false);
        } else {
            setPasswordChanged(true);
        }

        if (newPasswordsMatch && passwordChanged) {
            changePassword();
        }
    };

    const changePassword = async () => {
        const authToken = localStorage.getItem('token');

        axios.put(`${API_URL}/auth/password`,
            {
                oldPassword: currentPassword,
                newPassword: newPassword,
            },
            {
                headers: {
                    authToken: `${authToken}`
                }
            }
        ).then(() => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setSnackbarOpen(true);
            localStorage.removeItem('token');
            window.location.reload();
        }).catch(err => {
            console.log(err);
        });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const isSubmitDisabled = () => {
        return currentPassword === "" || newPassword === "" || confirmNewPassword === "" || !newPasswordsMatch || !passwordChanged;
    }

    useEffect(() => {
        if (newPassword === confirmNewPassword) {
            setNewPasswordsMatch(true);
        } else {
            setNewPasswordsMatch(false);
        }

        if (currentPassword === newPassword && newPassword !== "") {
            setPasswordChanged(false);
        } else {
            setPasswordChanged(true);
        }
    }, [newPassword, confirmNewPassword, currentPassword]);

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-xl font-medium">
                Change password
            </h4>

            <p className="text-gray-500">
                You will be required to login after changing your password
            </p>

            <form onSubmit={handleSubmit}>
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

                {!newPasswordsMatch && (
                    <Alert severity="error" className="w-full my-4" style={{ fontSize: '16px', padding: '16px' }}>
                        New Passwords do not match
                    </Alert>
                )}

                {!passwordChanged && (
                    <Alert severity="error" className="w-full my-4" style={{ fontSize: '16px', padding: '16px' }}>
                        New password cannot be the same as the current password
                    </Alert>
                )}

                <PrimaryButton
                    text="Change password"
                    className="w-1/6 min-w-[300px] px-0 py-3 text-lg max-md:w-full"
                    disabled={isSubmitDisabled()}
                />
            </form>

            <CustomSnackbar
                open={snackbarOpen}
                duration={6000}
                onClose={handleSnackbarClose}
                severity="success"
                message="Password has been updated"
            />
        </div>
    );
};

export default ChangePassword;

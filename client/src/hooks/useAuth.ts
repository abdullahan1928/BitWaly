import { useAuth } from '@/context/auth.context';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Severity = "error" | "warning" | "info" | "success";

interface IUseAuthForm {
    apiEndpoint: string;
    successMessage: string;
}

type FormEventHandler = React.FormEventHandler<HTMLFormElement>;

const useAuthForm = ({ apiEndpoint, successMessage }: IUseAuthForm) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>("success");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit: FormEventHandler = async (event: any) => {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        try {
            const res = await axios.post(apiEndpoint, { email, password });
            setSnackbarMessage(successMessage);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            login(res.data.authToken);
            navigate('/');
        } catch (err: any) {
            let errorMessage = "";
            if (err.response) {
                if (err.response.data || err.response.data.message) {
                    errorMessage = err.request.response;
                } else {
                    errorMessage = "An error occurred. Please try again.";
                }
            } else if (err.request) {
                errorMessage =
                    "No response from the server. Please check your connection.";
            } else {
                errorMessage = err.message;
            }

            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return { handleSubmit, snackbarOpen, setSnackbarOpen, snackbarMessage, snackbarSeverity };
};

export default useAuthForm;

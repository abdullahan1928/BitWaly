import axios from 'axios';
import { useState } from 'react';
import { useAuth } from './useAuth';

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
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit: FormEventHandler = async (event: any) => {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        try {
            setLoading(true); 

            const res = await axios.post(apiEndpoint, { email, password });

            const { authToken, role } = res.data;

            setSnackbarMessage(successMessage);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            login(authToken, role);

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
        } finally {
            setLoading(false); 
        }
    };

    return { handleSubmit, loading, snackbarOpen, setSnackbarOpen, snackbarMessage, snackbarSeverity };
};

export default useAuthForm;

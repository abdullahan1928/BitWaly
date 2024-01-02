import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomSnackbarProps {
    open: boolean;
    duration: number;
    onClose: () => void;
    severity: "error" | "warning" | "info" | "success";
    message: string;
}

const CustomSnackbar = ({ open, duration, onClose, severity, message }: CustomSnackbarProps) => {
    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;

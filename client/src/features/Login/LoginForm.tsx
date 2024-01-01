import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { API_URL } from "@/config/config.ts";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  type Severity = "error" | "warning" | "info" | "success";

  const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>("success");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios
      .post(`${API_URL}/auth/signin`, { email, password })
      .then((res) => {
        setSnackbarMessage("Signin successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // localStorage.setItem("token", res.data.authToken);
        login(res.data.authToken);
        navigate('/');
      })
      .catch((err) => {
        let errorMessage = "";
        if (err.response) {
          // Error response from the server
          if (err.response.data || err.response.data.message) {
            errorMessage = err.request.response;
          } else {
            // Default message if the specific message is not found
            errorMessage = "An error occurred. Please try again.";
          }
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage =
            "No response from the server. Please check your connection.";
        } else {
          // Something else caused the error
          errorMessage = err.message;
        }

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const styles: { [key: string]: string } = {
    label: "block text-gray-700 text-base font-bold mb-2",
    input:
      "rounded border-b-2 border-b-black w-full py-4 px-3 text-base text-gray-700 leading-tight focus:outline-none focus:border-b-primary-700",
    button:
      "bg-primary-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full",
    eyeIcon:
      "text-gray-500 cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2",
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-20 py-16 mb-4"
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl font-bold mb-12">
          <span className="text-3xl font-bold">
            Log In to start your journey
          </span>
        </h3>

        <div className="mb-8">
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="mb-8 relative">
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className={styles.input}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
            <span
              className={styles.eyeIcon}
              onClick={handleTogglePasswordVisibility}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-16 mb-8 text-lg">
          <span className="inline-block align-baseline font-bold text-primary-700 hover:text-primary-800">
            Don't have an account? &nbsp;
            <Link to="/signup" className="text-blue-500 hover:text-primary-800">
              Sign Up
            </Link>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button className={styles.button} type="submit">
            Sign In
          </button>
        </div>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;

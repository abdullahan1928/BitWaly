import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { API_URL } from "@/config/urls";
import { Link } from 'react-router-dom';
import CustomSnackbar from "@/components/CustomSnackbar";
import useAuthForm from "@/hooks/useAuthForm";
import CircularProgress from '@mui/material/CircularProgress';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, loading, snackbarOpen, setSnackbarOpen, snackbarMessage, snackbarSeverity } = useAuthForm({
    apiEndpoint: `${API_URL}/auth/signin`,
    successMessage: 'Login successful!',
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
    <div className="flex items-center justify-center h-screen">
      <form
        className="px-20 py-16 mb-4 bg-white rounded shadow-md"
        onSubmit={handleSubmit}
      >

        <Link to="/">
          <img
            src='/logo1.png'
            alt="logo"
            className="w-36 mb-4 mt-0 mx-auto cursor-pointer"
          />
        </Link>


        <h3 className="mb-12 text-3xl font-bold">
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
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="relative mb-8">
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className={styles.input}
              id="password"
              name="password"
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
          <span className="inline-block font-bold align-baseline">
            Don't have an account? &nbsp;
            <Link to="/signup" className="text-primary-600 hover:text-primary-800">
              Sign Up
            </Link>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </button>
        </div>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        duration={6000}
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />

    </div>
  );
};

export default LoginForm;

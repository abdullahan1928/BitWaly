import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/auth.context.tsx';
import { FilterProvider } from './context/filter.context.tsx';
import { ThemeProvider } from '@mui/material';
import theme from './mui.config.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.tsx';
import { FilterProvider } from './context/FilterLinks.tsx';
import { ThemeProvider } from '@mui/material';
import theme from './mui.config.ts';
import { DateFilterProvider } from './context/FilterLinkDetails.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <DateFilterProvider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </DateFilterProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

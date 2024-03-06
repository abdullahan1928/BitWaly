import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from '@mui/material';
import theme from './mui.config.ts';
import { SearchProvider } from './context/SearchContext.tsx';
import { FilterProvider } from './context/FilterLinksContext.tsx';
import { DateFilterProvider } from './context/FilterLinkDetailsContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <FilterProvider>
            <DateFilterProvider>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </DateFilterProvider>
          </FilterProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

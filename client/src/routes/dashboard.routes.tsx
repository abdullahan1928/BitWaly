import Dashboard from '@/pages/private/Dashboard';
import Links from '@/pages/private/Links';
import NewUrl from '@/pages/private/NewUrl';
import Settings from '@/pages/private/Settings';
import { Analytics } from '@mui/icons-material';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const DashboardRoutes: IDashboardRoute[] = [
    { index: true, element: <Dashboard /> },
    { path: 'link/new', element: <NewUrl /> },
    { path: 'links', element: <Links /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'settings', element: <Settings /> },
];

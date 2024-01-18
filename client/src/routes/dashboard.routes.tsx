import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const DashboardRoutes: IDashboardRoute[] = [
    { index: true, element: <Dashboard /> },
    { path: 'profile', element: <Profile /> },
];

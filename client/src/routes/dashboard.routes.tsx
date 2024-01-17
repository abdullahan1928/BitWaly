import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
// import Settings from '@/pages/Settings';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const dashboardRoutes: IDashboardRoute[] = [
    { index: true, element: <Dashboard /> },
    { path: 'profile', element: <Profile /> },
    // { path: 'settings', element: <Settings /> },
    // Add other dashboard routes here...
];

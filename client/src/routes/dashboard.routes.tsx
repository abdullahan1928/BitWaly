import LinkDetails from '@/pages/private/LinkDetails';
import Dashboard from '@/pages/private/Dashboard';
import Links from '@/pages/private/Links';
import NewLink from '@/pages/private/NewLink';
import Settings from '@/pages/private/Settings';
import EditLink from '@/pages/private/EditLink';
import Analytics from '@/pages/private/Analytics';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}
    
export const DashboardRoutes: IDashboardRoute[] = [
    { index: true, element: <Dashboard /> },
    { path: 'links', element: <Links /> },
    { path: 'links/:id', element: <LinkDetails /> },
    { path: 'link/new', element: <NewLink /> },
    { path: 'link/edit/:id', element: <EditLink /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'settings', element: <Settings /> },
];

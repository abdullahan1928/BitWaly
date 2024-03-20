import AdminAnalytics from '@/pages/Admin/AdminAnalytics';
import AdminDasbhoard from '@/pages/Admin/AdminDasbhoard';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const AdminRoutes: IDashboardRoute[] = [
    { index: true, element: <AdminDasbhoard /> },
    { path: 'analytics/:id', element: <AdminAnalytics /> },
];

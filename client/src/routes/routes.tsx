import { DashboardRoutes } from './dashboard.routes';
import { PublicRoutes } from './public.routes';
import { AuthRoutes } from './auth.routes';
import AuthGuard from '@/guards/AuthGuard';
import PublicGuard from '@/guards/PublicGuard';
import PublicLayout from '@/layouts/public/PublicLayout';
import { AdminRoutes } from './admin.routes';
import AdminGuard from '@/guards/AdminGurad';

interface IRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

interface IRoutes {
    path?: string;
    element?: JSX.Element;
    children?: IRoute[];
}

const routes: IRoutes[] = [
    {
        path: '/',
        element: (
            <>
                <PublicLayout />
                <PublicGuard />
            </>
        ),
        children: PublicRoutes,
    },
    {
        path: 'admin/*',
        element: <AdminGuard />,
        children: AdminRoutes,
    },
    {   
        path: 'dashboard/*',
        element: <AuthGuard />,
        children: DashboardRoutes,
    },
    {
        path: '*',
        element: <PublicGuard />,
        children: AuthRoutes
    }
];

export default routes;

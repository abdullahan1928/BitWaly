import Navbar from '@/layouts/Navbar';
import { DashboardRoutes } from './dashboard.routes';
import { PublicRoutes } from './public.routes';
import { AuthRoutes } from './auth.routes';
import AuthGuard from '@/guards/AuthGuard';
import PublicGuard from '@/guards/PublicGuard';

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
                <Navbar />
                <PublicGuard />
            </>
        ),
        children: PublicRoutes,
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

import Navbar from '@/layouts/Navbar';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Products from '@/pages/Products';
import Contact from '@/pages/Contact';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
// import { Dashboard } from '@/pages/Dashboard';
import PrivateRoute from '@/pages/PrivateRoute';
import { dashboardRoutes } from './dashboard.routes';

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
        element: <Navbar />,
        children: [
            { index: true, element: <Home /> },
            { path: 'products', element: <Products /> },
            { path: 'pricing', element: <Pricing /> },
            { path: 'contact', element: <Contact /> },
        ],
    },
    {
        path: 'dashboard/*',
        element: <PrivateRoute>{dashboardRoutes.map(route => route.element)}</PrivateRoute>,
    },
    {
        path: '*',
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <SignUp /> },
        ],
    }
];

export default routes;

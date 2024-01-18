import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Products from '@/pages/Products';
import Contact from '@/pages/Contact';

interface IPublicRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const PublicRoutes: IPublicRoute[] = [
    { index: true, element: <Home /> },
    { path: 'products', element: <Products /> },
    { path: 'pricing', element: <Pricing /> },
    { path: 'contact', element: <Contact /> },
];



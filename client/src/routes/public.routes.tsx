import Home from '@/pages/public/Home';
import Pricing from '@/pages/public/Pricing';
import Products from '@/pages/public/Products';
import Contact from '@/pages/public/Contact';

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



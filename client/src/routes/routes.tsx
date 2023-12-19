import Navbar from '@/layouts/Navbar';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Products from '@/pages/Products';
import Contact from '@/pages/Contact';

// Other components imports...

interface IRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

interface IRoutes {
    path?: string;
    element: JSX.Element;
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
            // Add other routes here...
        ],
    },
];

export default routes;

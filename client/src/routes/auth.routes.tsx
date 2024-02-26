import Login from '@/pages/public/Login';
import SignUp from '@/pages/public/SignUp';

interface IAuthRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}
    
export const AuthRoutes: IAuthRoute[] = [
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <SignUp /> },
];



import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';

interface IAuthRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const AuthRoutes: IAuthRoute[] = [
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <SignUp /> },
];



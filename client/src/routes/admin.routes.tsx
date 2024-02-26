import AdminDasbhoard from '@/pages/admin/AdminDasbhoard';

interface IDashboardRoute {
    index?: boolean;
    path?: string;
    element: JSX.Element;
}

export const AdminRoutes: IDashboardRoute[] = [
    { index: true, element: <AdminDasbhoard /> },
];

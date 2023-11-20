import './navbar.scss'
import { Outlet } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            Navbar
            <Outlet />
        </>
    );
};

export default Navbar
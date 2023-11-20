import './navbar.scss'
import { Outlet } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <nav>
                <div className="">
                    BitWaly
                </div>

                <div className="links">
                    <a className="link">Products</a>
                    <a className="link">Pricing</a>
                    <a className="link">Resources</a>
                </div>

                <div className="auth">
                    <a className="link">Login</a>
                    <a className="link">Sign Up</a>
                    <a className="link">Get a Quote</a>
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar
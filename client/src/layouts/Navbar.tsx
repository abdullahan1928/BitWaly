import PrimaryButton from '../components/PrimaryButton';
import { Outlet } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <nav
                className='text-black p-4 flex justify-between items-center my-0 mx-auto max-w-6xl'
            >
                <div className="">
                    <img src="logo.png" alt="logo" className='w-16' />
                </div>

                <div className="links flex justify-between items-center">
                    <a className="link ml-20 text-lg no-underline text-[#36383b] hover:underline">Products</a>
                    <a className="link ml-20 text-lg no-underline text-[#36383b] hover:underline">Pricing</a>
                    <a className="link ml-20 text-lg no-underline text-[#36383b] hover:underline">Resources</a>
                </div>

                <div className="auth flex justify-between items-center gap-4">
                    <a className="link no-underline ml-12 text-[#36383b] text-lg">Login</a>
                    <a className="link no-underline ml-12 text-lg text-[#2a5bd7]">Sign Up</a>
                    <PrimaryButton text="Get a Quote" className='py-3 px-2 ml-5' />
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar
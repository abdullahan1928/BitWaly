import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth.context';
import PrimaryButton from '../components/PrimaryButton';
import { Outlet } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <nav className='text-black p-4 flex justify-between items-center my-0 mx-auto max-w-6xl max-md:flex-col max-md:justify-between'>
        <Link to="/" className='mb-4 md:mb-0'>
          <img src="logo1.png" alt="logo" className='w-32' />
        </Link>

        <div className="links flex justify-between items-center mb-4 md:mb-0
        max-md:flex-col max-md:justify-between">
          <Link to='/products' className="link mx-4 md:mx-6 text-lg no-underline text-[#36383b]">
            Products
          </Link>
          <Link to='/pricing' className="link mx-4 md:mx-6 text-lg no-underline text-[#36383b]">
            Pricing
          </Link>
          <Link to='/resources' className="link mx-4 md:mx-6 text-lg no-underline text-[#36383b]">
            Resources
          </Link>
        </div>

        <div className="auth flex justify-between items-center gap-2 max-md:flex-col max-md:justify-between">
          {isAuthenticated ? (
            // Show Logout if user is authenticated
            <button onClick={logout} className="link no-underline ml-2 md:ml-4 text-[#36383b] text-lg">
              Logout
            </button>
          ) : (
            // Show Login and Sign Up if user is not authenticated
            <>
              <Link to='/login' className="link no-underline ml-2 md:ml-4 text-[#36383b] text-lg">
                Login
              </Link>
              <Link to='/signup' className="link no-underline ml-2 md:ml-4 text-lg text-primary">
                Sign Up
              </Link>
            </>
          )}
          <PrimaryButton text="Get a Quote" className='py-2 px-4 ml-2 md:ml-4' />
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;

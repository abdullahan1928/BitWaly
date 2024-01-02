import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth.context';
import PrimaryButton from '../components/PrimaryButton';
import { Outlet } from 'react-router-dom';
import CustomLink from '@/components/CustomLink';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <nav className='text-black p-4 flex justify-between items-center my-0 mx-auto max-w-6xl max-md:flex-col max-md:justify-between'>
        <Link to="/" className='mb-4 md:mb-0'>
          <img src="logo1.png" alt="logo" className='w-32' />
        </Link>

        <div className="flex justify-between items-center mb-4 md:mb-0 max-md:flex-col max-md:justify-between">
          <CustomLink to='/products'>
            Products
          </CustomLink>
          <CustomLink to='/pricing'>
            Pricing
          </CustomLink>
          <CustomLink to='/resources'>
            Resources
          </CustomLink>
        </div>

        <div className="auth flex justify-between items-center gap-2 max-md:flex-col max-md:justify-between">
          {isAuthenticated ? (
            <button onClick={logout} className="mx-4 md:mx-6 text-[#36383b] text-lg">
              Logout
            </button>
          ) : (
            <>
              <CustomLink to='/login'>
                Login
              </CustomLink>
              <CustomLink to='/signup' className="text-primary">
                Sign Up
              </CustomLink>
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

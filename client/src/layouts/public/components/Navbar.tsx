import { Link } from 'react-router-dom';
import PrimaryButton from '../../../components/PrimaryButton';
import CustomLink from '@/components/CustomLink';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className='flex items-center justify-between max-w-6xl p-4 mx-auto my-0 text-black max-md:flex-col max-md:justify-between'>
        <Link to="/" className='mb-4 md:mb-0'>
          <img src="logo1.png" alt="logo" className='w-32' />
        </Link>

        <div className="flex items-center justify-between mb-4 md:mb-0 max-md:flex-col max-md:justify-between">
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

        <div className="flex items-center justify-between gap-2 auth max-md:flex-col max-md:justify-between">
          {isAuthenticated ? (
            <button onClick={logout} className="mx-4 md:mx-6 text-[#36383b] text-lg">
              Logout
            </button>
          ) : (
            <>
              <CustomLink to='/login' className='font-medium'>
                Login
              </CustomLink>
              <CustomLink to='/signup' className="font-medium text-primary">
                Sign Up
              </CustomLink>
            </>
          )}
          <PrimaryButton text="Get a Quote" className='px-4 py-4 ml-2 md:ml-4' />
        </div>
      </nav >
    </>
  );
};

export default Navbar;

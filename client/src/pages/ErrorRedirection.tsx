import { Link } from 'react-router-dom';
const ErrorRedirection = () => {
    return (
        <div className='flex flex-col items-center'>
            <img src="error-404.svg" alt="404" className='w-1/5' />
            <h2 className='mt-4 text-3xl font-bold text-gray-800'>
                Something is wrong here.
            </h2>
            <p className='my-4 text-xl text-gray-600'>
                This is a 404 page. There might be different reasons for this error.
                <br />
                <br />
                <span className='font-bold'>1.</span> You might have entered a wrong URL.
                <br />
                <span className='font-bold'>2.</span> The page you are looking for might have been removed.
                <br />
                <span className='font-bold'>3.</span> The page might have been renamed.
                <br />
                <br />
                Please check the URL and try again. Go to the <Link to='/'>home page</Link> or <Link to='/contact'>contact us</Link> if you need any help.
            </p>
        </div >
    )
}

export default ErrorRedirection
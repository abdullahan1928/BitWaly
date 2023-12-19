import React from 'react'

const ErrorRedirection = () => {
    return (
        <div className='flex flex-col items-center'>
            <img src="error-404.svg" alt="404" className='w-1/5' />
            <h2 className='text-3xl font-bold text-gray-800 mt-4'>
                Something is wrong here.
            </h2>
            <p className='text-gray-600 my-4 text-xl'>
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
                Please check the URL and try again. Go to the <a href='/'>home page</a> or <a href='/contact'>contact us</a> if you need any help.
            </p>
        </div >
    )
}

export default ErrorRedirection
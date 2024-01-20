import { useState } from 'react';

const Hero = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className='mt-[50px] mb-[70px]'>
            <h1
                className={`text-center mb-[10px] text-[#252628] text-[58px] font-extrabold leading-[56px] ${isHovered ? 'hovered' : ''
                    } transition-all duration-1000 ease-in-out transform ${isHovered ? 'scale-105' : ''
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Make every{' '}
                <span className='text-primary'>
                    {isHovered ? (
                        <img src="/logo2.png" alt="Logo" className="inline w-20" />
                    ) : (
                        'connection'
                    )}
                </span>{' '}
                count
            </h1>
            <h2 className='text-center text-[#56575b] font-proxima-nova text-[24px] font-normal'>
                Create short links, QR Codes, and Link-in-bio pages. Share them anywhere.
                <br />
                Track what's working, and what's not. All inside the&nbsp;
                <strong>BitWaly Connections Platform</strong>.
            </h2>
        </div>
    );
};

export default Hero;

import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

interface IProps {
  text: string;
  className?: string;
  disabled?: boolean;
  onClick?: any;
}

const PrimaryButton = (props: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    try { 
      setLoading(true);
      if (props.onClick) {
        await props.onClick();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={twMerge(
        'bg-primary-700 rounded-md py-5 px-8 text-xl text-white cursor-pointer hover:bg-primary-600 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed relative',
        props.className
      )}
      disabled={props.disabled || loading}
      onClick={handleClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-t-2 border-primary-100 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      {props.text}
    </button>
  );
};

export default PrimaryButton;

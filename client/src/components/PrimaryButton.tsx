import { twMerge } from 'tailwind-merge';

interface IProps {
    text: string;
    className?: string;
    disabled?: boolean;
    onClick?: any;
}

const PrimaryButton = (props: IProps) => {
    return (
        <button
            className={twMerge(
                "bg-primary-700 rounded-md py-5 px-8 text-xl text-white cursor-pointer hover:bg-primary-600 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed",
                props.className
            )}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
}

export default PrimaryButton;

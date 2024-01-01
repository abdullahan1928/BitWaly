interface IProps {
    text: string;
    className?: string;
    disabled?: boolean;
}

const PrimaryButton = (props: IProps) => {
    return (
        <button className={`bg-primary-700 rounded-md py-5 px-8 text-xl text-white hover:bg-primary-600 transition duration-300 ease-in-out ${props.className}`} disabled={props.disabled}>
            {props.text}
        </button>
    );
}

export default PrimaryButton;


interface IProps {
    text: string;
    className?: string;
}

const PrimaryButton = (props: IProps) => {
    return (
        <button className={`bg-blue rounded-md py-5 px-8 text-xl text-white hover:bg-blue-700 transition duration-300 ease-in-out ${props.className}`}>
            {props.text}
        </button>
    );
}

export default PrimaryButton;

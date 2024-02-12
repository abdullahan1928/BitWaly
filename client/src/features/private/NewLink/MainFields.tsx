import CustomInput from "@/components/CustomInput";

interface MainFieldsProps {
    longUrl: string;
    setLongUrl: (longUrl: string) => void;
    title: string;
    setTitle: (title: string) => void;
}

const MainFields = ({ longUrl, setLongUrl, title, setTitle }: MainFieldsProps) => {
    return (
        <>
            <CustomInput
                label="Destination"
                value={longUrl}
                onChange={setLongUrl}
            />

            <CustomInput
                label="Title"
                value={title}
                onChange={setTitle}
                optional
            />
        </>
    );
};

export default MainFields;

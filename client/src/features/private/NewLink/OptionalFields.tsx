import DomainFields from "./components/DomainFields"
import TagsInput from "./components/TagsInput"

interface OptionalFieldsProps {
    tags: string[];
    handleTagChange: (newTags: string[]) => void;
    domain: string;
    setDomain: (domain: string) => void;
    backHalf: string;
    setBackHalf: (backHalf: string) => void;
    duplicateError: string | null;
}

const OptionalFields = ({
    tags,
    handleTagChange,
    domain,
    setDomain,
    backHalf,
    setBackHalf,
    duplicateError
}: OptionalFieldsProps) => {
    return (
        <>
            <h3 className="text-2xl font-medium">Customize Link</h3>

            <DomainFields
                domain={domain}
                setDomain={setDomain}
                backHalf={backHalf}
                setBackHalf={setBackHalf}
                duplicateError={duplicateError}
            />

            <TagsInput tags={tags} handleTagChange={handleTagChange} />
        </>
    )
}

export default OptionalFields
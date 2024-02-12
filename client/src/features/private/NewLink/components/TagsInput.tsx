import ChipsInput from "@/components/ChipsInput"

interface TagsInputProps {
    tags: string[];
    handleTagChange: (newTags: string[]) => void;
}

const TagsInput = ({ tags, handleTagChange }: TagsInputProps) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <p className="flex flex-row items-end justify-between">
                Tags
                <span className="text-base text-gray-500">(optional)</span>
            </p>
            <ChipsInput tags={tags} onTagChange={handleTagChange} />
        </div>
    )
}

export default TagsInput
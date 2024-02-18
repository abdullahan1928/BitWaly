import { useFilter } from '@/hooks/useFilter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useState, useEffect } from 'react';

interface TagsChipsProps {
    isLinksPage: boolean;
    tags: any;
}

const TagsChips = ({ tags, isLinksPage }: TagsChipsProps) => {

    const { tagFilter, setTagFilter, setTagFilterApplied } = useFilter();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleTagClick = (tagId: string) => {
        const updatedTagFilter = tagFilter.includes(tagId) ?
            tagFilter.filter((tag: any) => tag._id !== tagId) :
            [...tagFilter, tagId];

        if (isLinksPage) {
            setTagFilter(updatedTagFilter);
            setTagFilterApplied(true);
        }
    };

    const shouldShowCountOnly = windowWidth < 768;

    return (
        <div className="flex items-center gap-2">
            <LocalOfferIcon sx={{
                color: 'gray',
                width: '1.25rem',
            }} />
            <p>
                {tags.length > 0 ? (
                    <>
                        {!isLinksPage ? (
                            tags.map((tag: any, index: number) => (
                                <span
                                    key={index}
                                    className={
                                        `px-2 py-1 mr-1 text-sm font-semibold text-gray-800 bg-gray-200 
                                        ${isLinksPage && 'cursor-pointer hover:bg-gray-300'}
                                    `}
                                    onClick={() => handleTagClick(tag._id)}
                                >
                                    {tag.name}
                                </span>
                            ))
                        ) : (
                            <>
                                {shouldShowCountOnly ? (
                                    <span>{tags.length} tags</span>
                                ) : (
                                    <>
                                        {tags.slice(0, 3).map((tag: any, index: number) => (
                                            <span
                                                key={index}
                                                className={
                                                    `px-2 py-1 mr-1 text-sm font-semibold text-gray-800 bg-gray-200 
                                                    ${isLinksPage && 'cursor-pointer hover:bg-gray-300'}`
                                                }
                                                onClick={() => handleTagClick(tag._id)}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                        {isLinksPage && tags.length > 3 && (
                                            <span className="font-semibold text-gray-800">+{tags.length - 3} more</span>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <span>No tags</span>
                )}
            </p>
        </div>
    )
}

export default TagsChips;

import ChipsInputFilter from "@/features/private/Links/components/ChipsInputFilter";
import { SelectChangeEvent } from "@mui/material";
import { useFilter } from '@/context/FilterLinksContext';
import { useState, useEffect } from "react";
import LinkTypeFilter from "./components/LinkTypeFilter";

const LinksFilter = () => {
    const [linkType, setLinkType] = useState('all');
    const [tags, setTags] = useState<string[]>([]);
    const { setLinkTypeFilter, setTagFilter, linkTypeFilterApplied, setLinkTypeFiltersApplied, tagFilterApplied, setTagFilterApplied } = useFilter();

    useEffect(() => {
        const linkTypeFiltersActive = linkType !== 'all';
        setLinkTypeFiltersApplied(linkTypeFiltersActive);

        const tagFiltersActive = tags.length > 0;
        setTagFilterApplied(tagFiltersActive);

    }, [linkType, setLinkTypeFiltersApplied, setTagFilterApplied, tags]);

    const handleLinkChange = (event: SelectChangeEvent<string>) => {
        setLinkType(event.target.value);
        setLinkTypeFilter(event.target.value);
    }

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
        setTagFilter(newTags);
    }

    const clearFilters = () => {
        setLinkTypeFilter('all');
        setTagFilter([]);
        setLinkType('all');
        setTags([]);
    }

    return (
        <div className="flex gap-4 mb-4">

            <LinkTypeFilter
                linkType={linkType}
                handleLinkChange={handleLinkChange}
                filterApplied={linkTypeFilterApplied}
            />

            <ChipsInputFilter
                tags={tags}
                onTagChange={handleTagChange}
                className="w-72"
                filterApplied={tagFilterApplied}
            />

            {(linkTypeFilterApplied || tagFilterApplied) && (
                <button
                    className="px-4 py-2 text-base font-semibold text-white rounded-md bg-secondary-500 hover:bg-secondary-600"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            )}

        </div >
    );
};

export default LinksFilter;

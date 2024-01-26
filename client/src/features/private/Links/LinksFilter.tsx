
const LinksFilter = (onFilterChange: any) => {
    const handleDateFilter = (filterType: string) => {
        onFilterChange({ dateFilter: filterType });
    };

    const handleTagFilter = (tag: string) => {
        onFilterChange({ tagFilter: tag });
    };

    const handleLinkTypeFilter = (linkType: string) => {
        onFilterChange({ linkTypeFilter: linkType });
    };

    return (
        <div className="flex gap-4 mb-4">
            <button onClick={() => handleDateFilter('all')} className="px-4 py-2 bg-gray-300">All Dates</button>
            <button onClick={() => handleDateFilter('today')} className="px-4 py-2 bg-gray-300">Today</button>
            {/* Add more date filter options as needed */}

            {/* Tag filter buttons */}
            <button onClick={() => handleTagFilter('tag1')} className="px-4 py-2 bg-gray-300">Tag 1</button>
            <button onClick={() => handleTagFilter('tag2')} className="px-4 py-2 bg-gray-300">Tag 2</button>
            {/* Add more tag filter options as needed */}

            {/* Link type filter buttons */}
            <button onClick={() => handleLinkTypeFilter('type1')} className="px-4 py-2 bg-gray-300">Type 1</button>
            <button onClick={() => handleLinkTypeFilter('type2')} className="px-4 py-2 bg-gray-300">Type 2</button>
            {/* Add more link type filter options as needed */}
        </div>
    );
};

export default LinksFilter;

import { useState } from 'react';
import LinksFilter from '@/features/private/Links/LinksFilter';
import LinkCards from '@/features/private/Links/LinkCards';

const Links = () => {
    const [filters, setFilters] = useState({ dateFilter: 'all', tagFilter: null, linkTypeFilter: null });

    const handleFilterChange = (newFilters: any) => {
        setFilters({ ...filters, ...newFilters });
    };

    return (
        <div className="container max-w-6xl px-4 py-8 mx-auto">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
                Links
            </h2>

            <LinksFilter onFilterChange={handleFilterChange} />

            <p className="mb-4 text-gray-600">
                Your links will appear here.
            </p>

            <hr className="my-4 border-gray-400" />

            <LinkCards />
        </div>
    );
};

export default Links;

import LinksFilter from '@/features/private/Links/LinksFilter';
import LinkCards from '@/features/private/Links/LinkCards';
import { FilterProvider } from '@/context/FilterLinksContext';

const Links = () => {

    return (
        <FilterProvider>
            <div className="container max-w-6xl px-4 mx-auto">
                <h2 className="mb-8 text-4xl font-bold text-gray-800">
                    Links
                </h2>

                <LinksFilter />

                <p className="mb-4 text-gray-600">
                    Your links will appear here.
                </p>

                <hr className="my-4 border-gray-400" />

                <LinkCards />
            </div>
        </FilterProvider>
    );
};

export default Links;

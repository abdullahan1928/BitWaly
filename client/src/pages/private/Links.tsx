import LinkCards from '@/features/private/Links/LinkCards';

const Links = () => {

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Links
            </h2>

            <p className="text-gray-600 mb-4">
                Your links will appear here.
            </p>

            <hr className="my-4 border-gray-400" />

            <LinkCards />
        </div>
    )
}

export default Links
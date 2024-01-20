
const LinkSummary = () => {
    return (
        <div className="flex gap-10 my-8 justify-evenly">
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">
                    Engagements
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    3
                </span>
            </div>
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">
                    Last 7 days
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    3
                </span>
            </div>
            <div className="flex justify-between items-center rounded-lg w-full px-8 py-4 m-0 bg-white">
                <p className="text-xl text-[#526281]">

                    Weekly change
                </p>
                <span className="text-3xl text-[#526281] font-bold">
                    100%
                </span>
            </div>
        </div>
    )
}

export default LinkSummary
import { Analytics, AutoFixNormal, Link, Share, Leaderboard } from "@mui/icons-material"

const ListItem = ({ icon, text }: { icon: JSX.Element, text: string }) => {
    return (
        <li className="flex items-center space-x-4">
            {icon}
            <p className="text-lg font-normal">
                {text}
            </p>
        </li>
    )
}

const GettingStarted = () => {

    const listItems = [
        {
            icon: <Link sx={{ color: 'primary.main' }} />,
            text: "Shorten your first link"
        },
        {
            icon: <AutoFixNormal sx={{ color: 'primary.main' }} />,
            text: "Customize your link"
        },
        {
            icon: <Share sx={{ color: 'primary.main' }} />,
            text: "Share your shortened link"
        },
        {
            icon: <Analytics sx={{ color: 'primary.main' }} />,
            text: "Track your link Analytics"
        },
        {
            icon: <Leaderboard sx={{ color: 'primary.main' }} />,
            text: "Track overall performance"
        }
    ]

    return (
        <div className="p-16 bg-white border-2 border-gray-200 rounded-lg transform hover:scale-100 max-md:p-8">
            <h2 className="text-2xl font-semibold max-md:text-3xl max-md:text-center">
                Getting started with BitWaly
            </h2>

            <div className="flex flex-row justify-between gap-4 mt-8 max-md:flex-col">

                <div className="flex flex-col mt-4 w-1/2 space-y-4 max-md:w-full max-md:items-center">
                    {listItems.map((item, index) => (
                        <ListItem key={index} icon={item.icon} text={item.text} />
                    ))}
                </div>

                <div className="w-1/2 flex flex-row justify-center items-center cursor-pointer transform hover:scale-105 max-md:w-full">
                    <h2 className="text-[130px] font-bold max-md:text-[60px]">
                        <span className="text-primary">
                            B
                        </span>
                        <span className="text-secondary">
                            i
                        </span>
                        <span className="text-primary">
                            t
                        </span>
                    </h2>
                    <img src="/logo1.png" alt="Logo" className="p-2 h-2/3" />
                </div>
            </div>
        </div>
    )
}

export default GettingStarted
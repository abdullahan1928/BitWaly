import { Link } from "react-router-dom"

interface CardProps {
    img: string
    alt: string
    text: string
    linkText: string
    linkTo: string
}

const Card = ({ img, alt, text, linkText, linkTo }: CardProps) => {
    return (
        <div className="flex flex-row items-center justify-around gap-4 p-8 bg-white rounded-lg max-md:flex-col max-md:items-center">
            <img src={img} alt={alt} className="w-1/3 h-1/3 max-md:w-1/2 max-md:h-1/2" />

            <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-lg font-normal text-center">
                    {text}
                </p>

                <Link to={linkTo} className="p-2 font-semibold border-2 rounded-md text-md text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-white">
                    {linkText}
                </Link>
            </div>
        </div>
    )
}

const DashboardCards = () => {
    return (
        <div className="flex flex-row items-center justify-around gap-4 mb-8 max-md:flex-wrap">

            <Card
                img="/link.png"
                alt="Links shortening"
                text="Shorten your links"
                linkText="Shorten link"
                linkTo="link/new"
            />

            <Card
                img="/qr.png"
                alt="Links QR code"
                text="Make links scannable."
                linkText="Generate QR code"
                linkTo="link/new"
            />
        </div>
    )
}

export default DashboardCards
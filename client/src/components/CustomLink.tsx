import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}
    
const CustomLink = ({ to, children, className }: CustomLinkProps) => (
    <Link
        to={to}
        className={twMerge(
            "mx-4 md:mx-6 text-lg text-[#36383b]",
            className
        )}
    >
        {children}
    </Link>
);

export default CustomLink;

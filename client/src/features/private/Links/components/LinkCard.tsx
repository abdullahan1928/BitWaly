import DeleteDialog from '@/components/DeleteDialog';
import { REDIRECT_URL } from '@/config/config';
import { deleteUrl } from '@/features/public/Home/services/url.service';
import TrashIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CopyToClipboardButton from '@/components/Clipboard';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import { Link } from 'react-router-dom';

interface IUrl {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    meta?: {
        title: string;
        image: string;
    };
}

interface LinkCardProps extends IUrl {
    authToken: string | null;
    onDeleteUrl: (deletedUrlId: string) => void;
    showDetails?: boolean;
}

const LinkCard = (props: LinkCardProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

    const shortLink = `${REDIRECT_URL}/${props.shortUrl}`;

    const shortLinkWithoutProtocol = shortLink.replace('https://', '').replace('http://', '');

    const openDeleteDialog = (urlId: string) => {
        setUrlToDelete(urlId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setUrlToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleDelete = async () => {
        if (urlToDelete) {
            try {
                await deleteUrl(urlToDelete, props.authToken);
                console.log('URL deleted successfully');
                props.onDeleteUrl(urlToDelete);
            } catch (error) {
                console.error('Error deleting URL:', error);
            }
        }
        setUrlToDelete(null);
    };

    const inputDateString = props.createdAt;
    const inputDate = new Date(inputDateString);

    const formattedDate = inputDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC',
    });

    return (
        <div className="bg-white shadow-md rounded-md p-8 mb-4 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-800 cursor-pointer hover:underline">
                    {props.meta?.title}
                </h3>

                <div className="flex gap-2 items-center">
                    <CopyToClipboardButton text={shortLink} />

                    <EditIcon className="cursor-pointer" />

                    <TrashIcon className="cursor-pointer text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(props._id)} />
                </div>

            </div>

            <hr className="my-2" />

            <a
                href={shortLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-600 hover:underline text-lg font-semibold"
            >
                {shortLinkWithoutProtocol}
            </a>

            <a
                href={props.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-lg mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap cursor-pointer hover:underline"
            >
                {props.originalUrl}
            </a>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CalendarTodayIcon className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-500 text-sm">
                        {formattedDate}
                    </p>
                </div>

                {(props.showDetails ?? true) && (
                    <Link to={`/dashboard/link/${props._id}`} className='flex gap-1 border border-gray-400 rounded-md p-2 hover:bg-gray-200 items-center'>
                        <LinkIcon className="transform rotate-45" />
                        <p>
                            Details
                        </p>
                    </Link>
                )}
            </div>

            <DeleteDialog
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                handleDelete={handleDelete}
            />

        </div >
    )
}

export default LinkCard
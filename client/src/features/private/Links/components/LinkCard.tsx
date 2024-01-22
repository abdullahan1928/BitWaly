import DeleteDialog from '@/components/DeleteDialog';
import { REDIRECT_URL } from '@/config/config';
import { deleteUrl } from '@/features/public/Home/services/url.service';
import TrashIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CopyToClipboardButton from '@/components/Clipboard';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import { Link } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { FetchClicks } from '@/services/fetchClicks.service';
import { Tooltip } from '@mui/material';

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
    const [clicks, setClicks] = useState<number>(0);

    const shortLink = `${REDIRECT_URL}/${props.shortUrl}`;
    const shortLinkWithoutProtocol = shortLink.replace('https://', '').replace('http://', '');

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

    useEffect(() => {
        getClicks();
    }, [])

    const getClicks = async () => {
        if (!props.authToken) return;

        const res = await FetchClicks(props.authToken, props._id);
        setClicks(res);
    }

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

    return (
        <div className="bg-white shadow-md rounded-md p-8 mb-4 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800 cursor-pointer hover:underline">
                    <Link to={`/dashboard/link/${props._id}`}>
                        {props.meta?.title}
                    </Link>
                </h3>

                <div className="flex gap-2 items-center">
                    <CopyToClipboardButton text={shortLink} />

                    <Link to={`/dashboard/link/edit/${props._id}`} className="flex gap-1 border border-gray-400 rounded-md p-2 hover:bg-gray-200 items-center">
                        <Tooltip title="Edit">
                            <EditIcon className="cursor-pointer text-blue-500 hover:text-blue-600"
                            />
                        </Tooltip>
                    </Link>

                    <Tooltip title="Delete">
                        <TrashIcon className="cursor-pointer text-red-500 hover:text-red-600"
                            onClick={() => openDeleteDialog(props._id)}
                        />
                    </Tooltip>
                </div>

            </div>

            <hr className="my-2" />

            <a
                href={shortLink}
                target="_blank"
                rel="noreferrer"
                className="text-base text-blue-500 hover:text-blue-600 hover:underline font-semibold"
            >
                {shortLinkWithoutProtocol}
            </a>

            <a
                href={props.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-base mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap cursor-pointer hover:underline"
            >
                {props.originalUrl}
            </a>


            <div className="flex justify-between items-center">
                <div className="flex gap-6">
                    {(props.showDetails ?? true) && (
                        <div className="flex items-end gap-2">
                            <LeaderboardIcon className={`w-5 h-5 text-gray-500 ${clicks > 0 ? 'text-[#3C6946]' : ''}`} />
                            <span className={`text-sm ${clicks > 0 ? 'text-[#3C6946]' : ''} font-bold`}>
                                {clicks} engagements
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <CalendarTodayIcon className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-500">
                            {formattedDate}
                        </p>
                    </div>
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
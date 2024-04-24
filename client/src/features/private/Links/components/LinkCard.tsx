import DeleteDialog from '@/components/DeleteDialog';
import { API_URL, REDIRECT_URL } from '@/config/urls';
import { deleteUrl } from '@/features/public/Home/services/url.service';
import TrashIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CopyToClipboardButton from '@/components/Clipboard';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import { Link, useNavigate } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { FetchClicks } from '@/services/fetchClicks.service';
import { Tooltip } from '@mui/material';
import axios from 'axios';
import TagsChips from './TagsChips';
import Skeleton from '@mui/material/Skeleton';

interface IUrl {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    completedAt?: string;
    meta?: {
        title: string;
        image: string;
    };
}

interface LinkCardProps extends IUrl {
    onDeleteUrl: (deletedUrlId: string) => void;
    isLinksPage?: boolean;
    loading?: boolean;
}

const LinkCard = (props: LinkCardProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
    const [clicks, setClicks] = useState<number>(0);
    const [tags, setTags] = useState<string[]>([]);

    const image = props.meta?.image ?? 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://nustedupk0-my.sharepoint.com&size=32';

    const navigate = useNavigate();

    const shortLink = `${REDIRECT_URL}/${props.shortUrl}`;
    const shortLinkWithoutProtocol = shortLink.replace('https://', '').replace('http://', '');

    const createdAtString = props.createdAt;
    const createdAt = new Date(createdAtString);
    const formattedCreatedAt = props.isLinksPage ?
        createdAt.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        }) :
        createdAt.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'UTC',
        });

    const formattedCompletedAt = props.completedAt ? new Date(props.completedAt).toLocaleString('en-US',
        {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'UTC',
        }) : '';

    useEffect(() => {
        if (!props.loading) {
            getClicks();
            getTags();
        }
    }, []);

    const getClicks = async () => {
        const authToken = localStorage.getItem('token');

        if (!authToken) return;

        const res = await FetchClicks(authToken, props._id)

        setClicks(res);
    }

    const getTags = async () => {
        const authToken = localStorage.getItem('token');

        axios.get(`${API_URL}/tag/${props._id}`, {
            headers: {
                authToken: `${authToken}`
            }
        }).then((res: any) => {
            setTags(res.data);
        }).catch((err: any) => {
            console.error(err);
        })
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
        const authToken = localStorage.getItem('token');

        if (urlToDelete) {
            try {
                await deleteUrl(authToken, urlToDelete);
                console.log('URL deleted successfully');
                props.onDeleteUrl(urlToDelete);
                navigate('/dashboard/links');
            } catch (error) {
                console.error('Error deleting URL:', error);
            }
        }
        setUrlToDelete(null);
    };

    return (
        <div className="flex flex-row gap-2 p-8 bg-white rounded-md shadow-md max-lg:flex-col">
            <div className="flex flex-row justify-start flex-1 gap-4 mb-2">

                {props.loading ? (
                    <Skeleton variant="circular" width={48} height={48} />
                ) : (
                    <img
                        src={image}
                        alt="Link preview"
                        className="w-12 h-12 p-1 border-2 border-gray-300 rounded-full max-sm:hidden"
                    />
                )}

                <div className='flex flex-col flex-1 gap-4'>
                    {props.loading ? (
                        <Skeleton variant="text" width={200} height={30} />
                    ) : (
                        <h3 className="flex-1 text-lg font-bold text-gray-800 break-all cursor-pointer hover:underline line-clamp-1 max-md:text-3xl">
                            <Link to={`/dashboard/links/${props._id}`}>
                                {props.meta?.title}
                            </Link>
                        </h3>
                    )}

                    <div className="flex flex-col gap-2">

                        {props.loading ? (
                            <Skeleton variant="text" width={200} height={30} />
                        ) : (
                            <a
                                href={shortLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-base font-semibold text-blue-500 hover:text-blue-600 hover:underline"
                            >
                                {shortLinkWithoutProtocol}
                            </a>
                        )}

                        {props.loading ? (
                            <Skeleton variant="text" width={200} height={30} />
                        ) : (
                            <a
                                href={props.originalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mb-2 text-base break-all cursor-pointer hover:underline line-clamp-1"
                            >
                                {props.originalUrl}
                            </a>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex gap-6 max-sm:flex-col max-sm:gap-4">
                                {(props.isLinksPage ?? true) && (
                                    <div className="flex items-end gap-2">
                                        <LeaderboardIcon
                                            fontSize='small'
                                            className={
                                                `
                                        ${clicks > 0 ? 'text-[#3C6946]' : 'text-gray-500'}
                                        `}
                                        />
                                        <span className={`text-sm ${clicks > 0 ? 'text-[#3C6946]' : ''} font-bold`}>
                                            {clicks} engagements
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <CalendarTodayIcon className="w-5 h-5 text-gray-500" />
                                    {props.loading ? (
                                        <Skeleton variant="text" width={200} height={30} />
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-500">
                                                {formattedCreatedAt}
                                            </p>
                                            {formattedCompletedAt &&
                                                <>
                                                    -
                                                    <p className="text-sm text-gray-500">
                                                        {formattedCompletedAt}
                                                    </p>
                                                </>
                                            }
                                        </>
                                    )}
                                </div>

                                <TagsChips
                                    tags={tags}
                                    isLinksPage={props.isLinksPage ?? true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <hr className="my-2" />

            <div className="flex flex-col justify-between gap-2 max-lg:flex-row">

                <div className="flex items-center justify-between gap-2">
                    <CopyToClipboardButton text={shortLink} />

                    <Link to={`/dashboard/link/edit/${props._id}`} className="flex items-center gap-1 p-2 border border-gray-400 rounded-md hover:bg-gray-200">
                        <Tooltip title="Edit">
                            <EditIcon className="cursor-pointer text-primary-500 hover:text-primary-600"
                            />
                        </Tooltip>
                    </Link>

                    <Tooltip title="Delete">
                        <TrashIcon className="text-red-500 cursor-pointer hover:text-red-600"
                            onClick={() => openDeleteDialog(props._id)}
                        />
                    </Tooltip>
                </div>

                {(props.isLinksPage ?? true) && (
                    <Link
                        to={`/dashboard/links/${props._id}`}
                        className='flex items-center justify-center gap-1 p-2 border border-gray-400 rounded-md hover:bg-gray-200'
                    >
                        <LinkIcon className="transform rotate-45" />
                        <p className="text-lg">
                            Details
                        </p>
                    </Link>
                )}
            </div>

            <DeleteDialog
                heading="Delete Link?"
                body="Are you sure you want to delete this URL? <br/> This cannot be undone."
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                handleDelete={handleDelete}
            />

        </div >
    )
}

export default LinkCard

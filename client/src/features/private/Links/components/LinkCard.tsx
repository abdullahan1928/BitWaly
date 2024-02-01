import DeleteDialog from '@/components/DeleteDialog';
import { API_URL, REDIRECT_URL } from '@/config/config';
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
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useFilter } from '@/context/FilterLinksContext';

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
    const [tags, setTags] = useState<string[]>([]);

    const { tagFilter, setTagFilter, setTagFilterApplied } = useFilter();

    const image = props.meta?.image ?? 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://nustedupk0-my.sharepoint.com&size=32';

    const navigate = useNavigate();

    const shortLink = `${REDIRECT_URL}/${props.shortUrl}`;
    const shortLinkWithoutProtocol = shortLink.replace('https://', '').replace('http://', '');

    const inputDateString = props.createdAt;
    const inputDate = new Date(inputDateString);
    const formattedDate = props.showDetails ?
        inputDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }) :
        inputDate.toLocaleString('en-US', {
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
        getTags();
    }, [])

    const getClicks = async () => {
        if (!props.authToken) return;

        const res = await FetchClicks(props.authToken, props._id)

        setClicks(res);
    }

    const getTags = async () => {
        axios.get(`${API_URL}/tag/${props._id}`, {
            headers: {
                authToken: `${props.authToken}`
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
        if (urlToDelete) {
            try {
                await deleteUrl(props.authToken, urlToDelete);
                console.log('URL deleted successfully');
                props.onDeleteUrl(urlToDelete);
                navigate('/dashboard/links');
            } catch (error) {
                console.error('Error deleting URL:', error);
            }
        }
        setUrlToDelete(null);
    };

    const handleTagClick = (tagId: string) => {
        const updatedTagFilter = tagFilter.includes(tagId) ?
            tagFilter.filter((tag: any) => tag._id !== tagId) :
            [...tagFilter, tagId];

        if (props.showDetails) {
            setTagFilter(updatedTagFilter);
            setTagFilterApplied(true);
        }
    };

    return (
        <div className="flex flex-col gap-2 px-8 py-4 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-between flex-1 gap-4 mb-2">
                <img
                    src={image}
                    alt="Link preview"
                    className="w-12 h-12 p-1 border-2 rounded-full border-primary-400"
                />

                <h3 className="flex-1 text-lg font-bold text-gray-800 cursor-pointer hover:underline">
                    <Link to={`/dashboard/link/${props._id}`}>
                        {props.meta?.title}
                    </Link>
                </h3>

                <div className="flex items-center gap-2">
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

            </div>

            <hr className="my-2" />

            <a
                href={shortLink}
                target="_blank"
                rel="noreferrer"
                className="text-base font-semibold text-blue-500 hover:text-blue-600 hover:underline"
            >
                {shortLinkWithoutProtocol}
            </a>

            <a
                href={props.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-2 overflow-hidden text-base cursor-pointer overflow-ellipsis whitespace-nowrap hover:underline"
            >
                {props.originalUrl}
            </a>

            <div className="flex items-center justify-between">
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

                    <div className="flex items-center gap-2">
                        <LocalOfferIcon sx={{
                            color: 'gray',
                            width: '1.25rem',
                        }} />
                        <p>
                            {tags.length > 0 ?
                                tags.map((tag: any, index: number) => {
                                    return (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 mr-1 text-sm font-semibold text-gray-800 bg-gray-200 
                                            ${props.showDetails && 'cursor-pointer hover:bg-gray-300'}
                                            `}
                                            onClick={() => handleTagClick(tag._id)}
                                        >
                                            {tag.name}
                                        </span>
                                    )
                                }
                                ) : (
                                    <span>
                                        No tags
                                    </span>
                                )}
                        </p>
                    </div>
                </div>

                {(props.showDetails ?? true) && (
                    <Link to={`/dashboard/link/${props._id}`} className='flex items-center gap-1 p-2 border border-gray-400 rounded-md hover:bg-gray-200'>
                        <LinkIcon className="transform rotate-45" />
                        <p>
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
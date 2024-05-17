//analtyics page that is rendered when user clicks on a link for its details
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LinkBarChart from "@/features/private/LinkDetails/LinkBarChart";
import { UrlRetrievalById } from "@/services/retrieveUrl.service";
import LinkLocations from "@/features/private/LinkDetails/LinkLocations";
import LinkReferres from "@/features/private/LinkDetails/LinkReferres";
import LinkDevices from "@/features/private/LinkDetails/LinkDevices";
import LinkCard from "@/features/private/Links/components/LinkCard";
import LinkSummary from "@/features/private/LinkDetails/LinkSummary";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange, PickersShortcutsItem } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { useDateFilter } from "@/hooks/useDateFilter";
import { MenuItem, Select } from "@mui/material";
import axios from "axios";
import { API_URL } from "@/config/urls";

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

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
        label: 'Today',
        getValue: () => {
            const today = dayjs();
            return [today, today];
        },
    },
    {
        label: 'Yesterday',
        getValue: () => {
            const yesterday = dayjs().subtract(1, 'day');
            return [yesterday, yesterday];
        },
    },
    {
        label: 'Last Hour',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(1, 'hour'), today];
        },
    },
    {
        label: 'Last Week',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
        },
    },
    {
        label: 'Last Month',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(1, 'month'), today];
        },
    },
    {
        label: 'Reset',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(1, 'month'), today];
        }
    }
];

const LinkDetails = () => {
    const [urlData, setUrlData] = useState<IUrl>({} as IUrl);
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
    const [loading, setLoading] = useState(true);
    const [minDate, setMinDate] = useState<Dayjs | null>(dayjs());
    const [formerUrls, setFormerUrls] = useState<string[]>([]);
    const [urlDataMap, setUrlDataMap] = useState<IUrl[]>([]);
    const { id } = useParams<{ id: string }>();
    const [urlId, setUrlId] = useState<string>(id ?? '');

    const createdDate = new Date(urlData.createdAt).toLocaleString('en-US', {
        timeZone: 'UTC',
    });

    const { updateDates } = useDateFilter();


    useEffect(() => {
        const minDateFromUrlData = dayjs(createdDate);
        console.log(minDateFromUrlData)
        const lastMonth = dayjs().subtract(1, 'month');
        console.log('last month',lastMonth)

        const minDate = minDateFromUrlData.isAfter(lastMonth) ? lastMonth : minDateFromUrlData;

        setMinDate(minDate);
        setDateRange([minDate, dayjs()]);
    }, [createdDate]);

    useEffect(() => {
        const authToken = localStorage.getItem("token");
        const fetchFormerTitles = async () => {
            try {
                const promises = formerUrls.map(async (url) => {
                    const res = await axios.get(`${API_URL}/formerUrl/id/${url}`, {
                        headers: {
                            authToken: `${authToken}`,
                        },
                    });
                    return res.data;
                });

                const formerData = await Promise.all(promises);
                setUrlDataMap([urlData, ...formerData]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchFormerTitles();
    }, [formerUrls]);

    useEffect(() => {
        fetchLink();
        console.log(urlDataMap)
    }, []);

    const fetchLink = async () => {
        const authToken = localStorage.getItem("token");

        try {
            const res = await UrlRetrievalById(authToken ?? '', id ?? '');
            setUrlData(res.url);
            setFormerUrls(res.url.formerUrls);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDateChange = (newDateRange: DateRange<Dayjs>) => {
        setDateRange(newDateRange);
        updateDates(newDateRange[0]?.toDate() ?? new Date(), newDateRange[1]?.toDate() ?? new Date());
    }

    return (
        <div className="container flex flex-col max-w-6xl gap-8 p-4 mx-auto w-full h-full">
            <Link to="/dashboard/links" className="flex items-center text-primary hover:underline">
                <ChevronLeftIcon className='inline-block text-base' />
                <p className='inline-block ml-2 text-base'>
                    Back to Links
                </p>
            </Link>

            <Select
                label="Filter by Created Date"
                variant="standard"
                defaultValue={id}
            >
                {urlDataMap.map((data) => (
                    <MenuItem key={data._id} value={data._id}
                        onClick={() => {
                            setUrlData(data);
                            setUrlId(data._id);
                        }}
                    >
                        {data.meta?.title}
                    </MenuItem>
                ))}
            </Select>

            <LinkCard
                _id={urlId}
                originalUrl={urlData?.originalUrl ?? ''}
                shortUrl={urlData?.shortUrl ?? ''}
                createdAt={createdDate ?? ''}
                completedAt={urlData?.completedAt}
                meta={urlData?.meta}
                onDeleteUrl={() => { }}
                isLinksPage={false}
                loading={loading}
            />

            <LinkSummary id={urlId} />

            <div className="flex flex-row gap-4 items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        slots={{
                            field: SingleInputDateRangeField,
                        }}
                        slotProps={{
                            shortcuts: {
                                items: shortcutsItems,
                            },
                            actionBar: { actions: [] },
                        }}
                        name="allowedRange"
                        minDate={minDate || undefined}
                        maxDate={dayjs()}
                        label="Filter by Created Date"
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
            </div>

            <LinkBarChart id={urlId} />

            <LinkLocations id={urlId} />

            <div className="flex flex-row flex-wrap gap-10 mb-4">
                <LinkReferres id={urlId} />

                <LinkDevices id={urlId} />
            </div>
        </div >
    );
};

export default LinkDetails;

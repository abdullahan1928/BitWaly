import ChipsInputFilter from "@/features/private/Links/components/ChipsInputFilter";
import { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import LinkTypeFilter from "./components/LinkTypeFilter";
import { useFilter } from "@/hooks/useFilter";
import { useSearch } from "@/hooks/useSearch";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange, PickersShortcutsItem } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

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
    { label: 'Reset', getValue: () => [null, null] },
];

const LinksFilter = () => {
    const [linkType, setLinkType] = useState('all');
    const [tags, setTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
    const {
        linkTypeFilterApplied,
        tagFilterApplied,
        dateFilterApplied,
        setLinkTypeFilter,
        setTagFilter,
        setDateFilter,
        setLinkTypeFiltersApplied,
        setTagFilterApplied,
        setDateFilterApplied,
    } = useFilter();
    const { searchValue, searchActive, setSearchActive, clearSearch } = useSearch();

    useEffect(() => {
        const linkTypeFiltersActive = linkType !== 'all';
        setLinkTypeFiltersApplied(linkTypeFiltersActive);

        const tagFiltersActive = tags.length > 0;
        setTagFilterApplied(tagFiltersActive);

        const dateFiltersActive = dateRange[0] !== null && dateRange[1] !== null;

        setDateFilterApplied(dateFiltersActive);

        const isSearchActive = searchValue !== '';
        setSearchActive(isSearchActive);

    }, [dateFilterApplied, dateRange, linkType, searchValue, setDateFilterApplied, setLinkTypeFiltersApplied, setSearchActive, setTagFilterApplied, tags]);

    const handleLinkChange = (event: SelectChangeEvent<string>) => {
        setLinkType(event.target.value);
        setLinkTypeFilter(event.target.value);
    }

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
        setTagFilter(newTags);
    }

    const handleDateChange = (newDateRange: DateRange<Dayjs>) => {
        setDateRange(newDateRange);
        setDateFilter(newDateRange);
    }

    const clearFilters = () => {
        setLinkTypeFilter('all');
        setTagFilter([]);
        setDateFilter([null, null]);
        setLinkType('all');
        setTags([]);
        setDateRange([null, null]);
        clearSearch();
    }

    return (
        <div className="flex flex-wrap gap-4 mb-4 max-lg:mb-8 max-md:flex-wrap">

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
                    maxDate={dayjs()}
                    format="DD/MM/YYYY"
                    sx={{
                        width: 260,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: dateFilterApplied ? 'primary.main' : 'none',
                            },
                            '&:hover fieldset': {
                                borderColor: dateFilterApplied ? 'primary.main' : 'none',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: dateFilterApplied ? 'primary.main' : 'none',
                            },
                        }
                    }}
                    label="Filter by Created Date"
                />
            </LocalizationProvider>

            <LinkTypeFilter
                linkType={linkType}
                handleLinkChange={handleLinkChange}
                filterApplied={linkTypeFilterApplied}
            />

            <ChipsInputFilter
                tags={tags}
                onTagChange={handleTagChange}
                className="w-64"
                filterApplied={tagFilterApplied}
            />

            {(linkTypeFilterApplied || tagFilterApplied || dateFilterApplied || searchActive) && (
                <button
                    className="px-4 py-2 text-base font-semibold text-white rounded-md bg-secondary-500 hover:bg-secondary-600"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            )}

        </div >
    );
};

export default LinksFilter;

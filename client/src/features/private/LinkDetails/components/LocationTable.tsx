import { CityData } from "../interfaces/CityData";
import { CountryData } from "../interfaces/CoutryData";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";

interface DataTableProps {
    title: string;
    data: CountryData[] | CityData[];
    loading?: boolean;
    isEmpty?: boolean;
}


const LocationTable = ({ title, data, loading, isEmpty }: DataTableProps) => {
    const isCountryData = (
        data: CountryData | CityData
    ): data is CountryData => {
        return (data as CountryData).country !== undefined;
    };

    const isCityData = (data: CountryData | CityData): data is CityData => {
        return (data as CityData).city !== undefined;
    };

    const calculateTotalPercentage = () => {
        const totalCount = data.reduce(
            (accumulator, currentItem) => accumulator + currentItem.count,
            0
        );

        return totalCount > 0 ? totalCount : 1;
    };

    const SingleSkelton = ({ width }: { width?: number }) => (
        <TableCell>
            <Skeleton variant="text" width={width} height={20} animation={isEmpty && false} />
        </TableCell>
    );

    const TableSkeleton = () => (
        <div className="flex flex-col gap-4 p-4 relative">
            {[1, 2, 3, 4, 5].map((_, index) => (
                <TableRow key={index}>
                    <SingleSkelton width={50} />
                    <SingleSkelton width={100} />
                    <SingleSkelton width={500} />
                    <SingleSkelton width={100} />
                    <SingleSkelton width={100} />
                </TableRow>
            ))}

            <div className="absolute flex flex-col items-center justify-center p-4 w-full h-full top-0 left-0 bg-white bg-opacity-60 rounded-md">
                <p className="absolute text-2xl font-bold text-center text-gray-500">
                    No engagements found for the selected date range.
                    <span className="block text-lg text-gray-500 font-medium">
                        <br />
                        Share your link to get engagements.
                    </span>
                </p>
            </div>
        </div>
    );

    return (
        <Table sx={{
            minWidth: 650,
            'media (max-width: 640px)': {
                minWidth: 300,
            },
        }}>

            {!isEmpty ? (
                <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                        <TableCell>Sr#</TableCell>
                        <TableCell>
                            {title}
                        </TableCell>
                        <TableCell
                            sx={{
                                '@media (max-width: 640px)': {
                                    display: 'none',
                                },
                            }}
                        ></TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>Engagements</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>%</TableCell>
                    </TableRow>
                </TableHead>
            ) : null}

            <TableBody sx={{ '& td': { border: 'none' }, }}>
                {loading || isEmpty ? (
                    <TableSkeleton />
                ) : (
                    data.map((item, index) => (
                        <TableRow key={index} style={{ whiteSpace: 'nowrap' }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                {isCountryData(item)
                                    ? item.country
                                    : isCityData(item)
                                        ? item.city
                                        : ""}
                            </TableCell>
                            <TableCell sx={{
                                position: 'relative',
                                width: '100%',
                                '@media (max-width: 640px)': {
                                    display: 'none',
                                },
                            }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(item.count / calculateTotalPercentage()) * 100}
                                    sx={{
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: '#f4f6fa',
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        margin: 'auto',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 6,
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{item.count}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {Math.round((item.count / calculateTotalPercentage()) * 100)}%
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default LocationTable;

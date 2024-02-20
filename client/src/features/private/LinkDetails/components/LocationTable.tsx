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
}

const LocationTable = ({ title, data, loading }: DataTableProps) => {
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

    return (
        <Table sx={{
            minWidth: 650,
            'media (max-width: 640px)': {
                minWidth: 300,
            },
        }}>
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
            <TableBody sx={{ '& td': { border: 'none' }, }}>
                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <TableRow key={index}>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <TableCell key={index}>
                                        {index === 0 ? <Skeleton variant="text" width={50} height={50} /> : ""}
                                        {index === 1 ? <Skeleton variant="text" width={100} height={50} /> : ""}
                                        {index === 2 ? <Skeleton variant="text" width={500} height={50} /> : ""}
                                        {index === 3 ? <Skeleton variant="text" width={100} height={50} /> : ""}
                                        {index === 4 ? <Skeleton variant="text" width={100} height={50} /> : ""}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </>
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

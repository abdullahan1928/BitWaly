import React, { useState } from "react";
import { LinearProgress, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { CityData } from "../LinkDetails/interfaces/CityData";
import { CountryData } from "../LinkDetails/interfaces/CoutryData";

interface VerticalLocationTableProps {
    title: string;
    data: CountryData[] | CityData[];
    loading: boolean;
}

const VerticalLocationTable = ({ title, data, loading }: VerticalLocationTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isCountryData = (data: CountryData | CityData): data is CountryData => {
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

    const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
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
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton variant="text" width={30} height={50} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={100} height={50} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={250} height={50} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={100} height={50} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={50} height={50} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        displayedData.map((item, index) => (
                            <TableRow key={index} style={{ whiteSpace: 'nowrap' }}>
                                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                <TableCell>
                                    {isCountryData(item)
                                        ? item.country
                                        : isCityData(item)
                                            ? item.city
                                            : ""}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        '@media (max-width: 640px)': {
                                            display: 'none',
                                        },
                                    }}
                                >
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
                                    {((item.count / calculateTotalPercentage()) * 100).toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table >
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default VerticalLocationTable;

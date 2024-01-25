import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config/config";
import { Tabs, Tab, Paper, Box } from "@mui/material";

interface LinkLocationProps {
    id: string;
    authToken: string;
}

interface CountryData {
    country: string;
    count: number;
}

interface CityData {
    city: string;
    count: number;
}

const CustomTab = (props: any) => {
    return (
        <Tab
            sx={{
                textTransform: "none",
                fontSize: "1em",
                minHeight: "unset",
                height: "2.2rem",
                "&.Mui-selected": {
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "2rem",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                },
            }}
            disableRipple
            {...props}
        />
    );
}

const LinkLocations = ({ id, authToken }: LinkLocationProps) => {
    const [countryData, setCountryData] = useState<CountryData[]>([]);
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        axios.get(`${API_URL}/analytics/location/${id}`, {
            headers: {
                authToken: `${authToken}`,
            },
        }).then((res) => {
            const data = res.data;

            const countryData: CountryData[] = data.countries.map(
                (data: CountryData) => ({
                    country: data.country,
                    count: data.count,
                })
            );

            const cityData: CityData[] = data.cities.map((city: CityData) => ({
                city: city.city,
                count: city.count,
            }));

            setCountryData(countryData);
            setCityData(cityData);
        }).catch((err) => {
            console.log(err);
        });
    }, [id, authToken]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Paper className="bg-white rounded-md shadow-md p-8 my-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold mb-4">Locations</h3>
                <Tabs value={currentTab} onChange={handleTabChange} className="mb-4 rounded-[2rem] bg-[#f4f6fa] gap-4 border-2"
                    TabIndicatorProps={{
                        style: {
                            display: 'none',
                        }
                    }}
                    sx={{
                        minHeight: "unset",
                        height: "2.5rem",
                    }}
                >
                    <CustomTab label="Countries" />
                    <CustomTab label="Cities" />
                </Tabs>
            </div>
            <TabPanel value={currentTab} index={0}>
                <DataTable data={countryData} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <DataTable data={cityData} />
            </TabPanel>
        </Paper>
    );
};

interface DataTableProps {
    data: (CountryData | CityData)[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => (
    <table className="w-full">
        <thead>
            <tr>
                <th className="text-left">Sr#</th>
                <th className="text-left">Location</th>
                <th className="text-left">Engagements</th>
                {/* Add any other columns as needed */}
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.country || item.city}</td>
                    <td>{item.count}</td>
                    {/* Add any other columns as needed */}
                </tr>
            ))}
        </tbody>
    </table>
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <Box hidden={value !== index} mt={2}>
        {children}
    </Box>
);

export default LinkLocations;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config/urls";
import { Tabs, Paper } from "@mui/material";
import TabPanel from "./components/TabPanel";
import { CountryData } from "./interfaces/CoutryData";
import { CityData } from "./interfaces/CityData";
import CustomTab from "./components/CustomTab";
import LocationTable from "./components/LocationTable";
import { authToken } from "@/config/authToken";

interface LinkLocationProps {
    id: string;
    startDate: Date;
    endDate: Date;
}

const LinkLocations = ({ id, startDate, endDate }: LinkLocationProps) => {
    const [countryData, setCountryData] = useState<CountryData[]>([]);
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        axios.get(`${API_URL}/analytics/location/${id}`, {
            headers: {
                authToken: `${authToken}`,
            },
        }).then((res) => {
            const data = res.data;

            const countryData: CountryData[] = data.countries.map((data: CountryData) => ({
                country: data.country,
                count: data.count,
            })
            );
            const cityData: CityData[] = data.cities.map((data: CityData) => ({
                city: data.city,
                count: data.count,
            }));


            setCountryData(countryData);
            setCityData(cityData);
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Paper className="p-8 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="mb-4 text-xl font-bold">Locations</h3>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    className="mb-4 rounded-[2rem] bg-[#f4f6fa] gap-4 border-2"
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
                <LocationTable data={countryData} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <LocationTable data={cityData} />
            </TabPanel>
        </Paper>
    );
};

export default LinkLocations;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config/config";
import { Tabs, Paper } from "@mui/material";
import TabPanel from "./components/TabPanel";
import { CountryData } from "./interfaces/CoutryData";
import { CityData } from "./interfaces/CityData";
import CustomTab from "./components/CustomTab";
import LocationTable from "./components/LocationTable";

interface LinkLocationProps {
    id: string;
    authToken: string;
}

const LinkLocations = ({ id, authToken }: LinkLocationProps) => {
    const [countryData, setCountryData] = useState<CountryData[]>([]);
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

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
        <Paper className="bg-white rounded-md shadow-md p-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold mb-4">Locations</h3>
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

import React, { useState, useEffect } from "react";
import { Tabs } from "@mui/material";
import CustomTab from "../LinkDetails/components/CustomTab";
import TabPanel from "../LinkDetails/components/TabPanel";
import { fetchLocations } from "@/services/analyticsSummary";  // Import your service
import { CountryData } from "../LinkDetails/interfaces/CoutryData";
import { CityData } from "../LinkDetails/interfaces/CityData";
import VerticalLocationTable from "./VerticalLocationTable";
import { authToken } from "@/config/authToken";

const Location = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [locationData, setLocationData] = useState({ countries: [], cities: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authToken !== null) {
                    const responseData = await fetchLocations(authToken);
                    if (responseData && responseData.countries && responseData.cities) {
                        setLocationData({
                            countries: responseData.countries.map((data: CountryData) => ({
                                country: data.country,
                                count: data.count,
                            })),
                            cities: responseData.cities.map((data: CityData) => ({
                                city: data.city,
                                count: data.count,
                            })),
                        });
                    } else {
                        console.error('Invalid response structure:', responseData);
                    }
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };
    
        fetchData();
    }, []);
    

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <div className="p-8 bg-white rounded-xl">
            <div className="flex items-center justify-between">
                <h3 className="mb-4 text-xl font-bold">Clicks & scans by All Locations</h3>
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
                <VerticalLocationTable data={locationData.countries} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <VerticalLocationTable data={locationData.cities} />
            </TabPanel>
        </div>
    );
};

export default Location;

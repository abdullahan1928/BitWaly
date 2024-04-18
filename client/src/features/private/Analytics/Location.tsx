import React, { useState, useEffect } from "react";
import { Tabs } from "@mui/material";
import CustomTab from "../LinkDetails/components/CustomTab";
import TabPanel from "../LinkDetails/components/TabPanel";
import { fetchLocationsWithAdmin } from '@/services/adminAnalytics.service';
import { CountryData } from "../LinkDetails/interfaces/CoutryData";
import { CityData } from "../LinkDetails/interfaces/CityData";
import VerticalLocationTable from "./VerticalLocationTable";
import { useParams } from "react-router-dom";
import { fetchLocations } from "@/services/analyticsSummary.service";

const Location = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [locationData, setLocationData] = useState<{ countries: CountryData[], cities: CityData[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const authToken = localStorage.getItem("token");

        if (authToken === null) { return; }

        const fetchData = async () => {
            try {
                let response: any;

                if (id !== null && id !== undefined) {
                    response = await fetchLocationsWithAdmin(authToken, id);
                } else {
                    response = await fetchLocations(authToken);
                }

                if (response && response.countries && response.cities) {
                    setLocationData({
                        countries: response.countries.map((data: CountryData) => ({
                            country: data.country,
                            count: data.count,
                        })),
                        cities: response.cities.map((data: CityData) => ({
                            city: data.city,
                            count: data.count,
                        })),
                    });
                    setLoading(false);
                } else {
                    console.error('Invalid response structure:', response);
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error fetching location data:', error);
                setLoading(false);
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
                <VerticalLocationTable
                    title="Country"
                    data={locationData?.countries || []}
                    loading={loading}
                />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <VerticalLocationTable
                    title="City"
                    data={locationData?.cities || []}
                    loading={loading}
                />
            </TabPanel>
        </div>
    );
};

export default Location;

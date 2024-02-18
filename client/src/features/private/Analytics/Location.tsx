import React, { useState } from "react";
import { Tabs } from "@mui/material";
import CustomTab from "../LinkDetails/components/CustomTab";
import TabPanel from "../LinkDetails/components/TabPanel";
import { CountryData } from "../LinkDetails/interfaces/CoutryData";
import { CityData } from "../LinkDetails/interfaces/CityData";
import VerticalLocationTable from "./VerticalLocationTable";

const Location = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const countryData: CountryData[] = [
        { country: "India", count: 152, },
        { country: "USA", count: 23, },
        { country: "UK", count: 56, },
        { country: "Canada", count: 27, },
        { country: "Australia", count: 48, },
        { country: "Germany", count: 5, },
        { country: "France", count: 3, },
        { country: "Italy", count: 2, },
        { country: "Spain", count: 43, },
        { country: "Brazil", count: 1, },
        { country: "Russia", count: 15, },
        { country: "China", count: 34, },
        { country: "Japan", count: 18, },
    ];
    
    const cityData: CityData[] = [
        { city: "New Delhi", count: 100, },
        { city: "New York", count: 50, },
        { city: "London", count: 30, },
        { city: "Toronto", count: 20, },
        { city: "Sydney", count: 10, },
        { city: "Berlin", count: 5, },
        { city: "Paris", count: 3, },
        { city: "Rome", count: 2, },
        { city: "Madrid", count: 1, },
        { city: "Rio de Janeiro", count: 1, },
        { city: "Moscow", count: 1, },
        { city: "Shanghai", count: 1, },
        { city: "Tokyo", count: 1, },
    ];

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <div className="p-8 bg-white rounded-xl">
            <div className="flex items-center justify-between">
                <h3 className="mb-4 text-xl font-bold">Clicks + scans by location</h3>
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
                <VerticalLocationTable data={countryData} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <VerticalLocationTable data={cityData} />
            </TabPanel>
        </div>
    );
};

export default Location;

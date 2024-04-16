import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/config/urls";
import { Tabs, Paper } from "@mui/material";
import TabPanel from "./components/TabPanel";
import { CountryData } from "./interfaces/CoutryData";
import { CityData } from "./interfaces/CityData";
import CustomTab from "./components/CustomTab";
import LocationTable from "./components/LocationTable";
import { useDateFilter } from "@/hooks/useDateFilter";

interface LinkLocationProps {
    id: string;
}

interface LocationData {
    date: string;
    country: string;
    city: string;
}

const LinkLocations = ({ id }: LinkLocationProps) => {
    const [locationData, setLocationData] = useState<LocationData[]>([]);
    const [countryData, setCountryData] = useState<CountryData[]>([]);
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(true);

    const { startDate, endDate } = useDateFilter();

    const fetchData = useCallback(async () => {
        setLoading(true);

        const authToken = localStorage.getItem("token");

        axios.get(`${API_URL}/analytics/location/${id}`, {
            headers: {
                authToken: `${authToken}`,
            },
        }).then((res) => {
            const data: LocationData[] = res.data;

            setLocationData(data);

            showData(data);

            setLoading(false);
            setIsEmpty(data.length === 0);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, [id]);

    const showData = (data: LocationData[]) => {
        const countryMap = new Map<string, number>();
        const cityMap = new Map<string, number>();

        const countryData: CountryData[] = data.reduce((acc, item) => {
            if (countryMap.has(item.country)) {
                const index = acc.findIndex((country) => country.country === item.country);
                acc[index].count += 1;
            } else {
                countryMap.set(item.country, 1);
                acc.push({
                    country: item.country,
                    count: 1,
                });
            }

            return acc;
        }, [] as CountryData[]);

        const cityData: CityData[] = data.reduce((acc, item) => {
            if (cityMap.has(item.city)) {
                const index = acc.findIndex((city) => city.city === item.city);
                acc[index].count += 1;
            } else {
                cityMap.set(item.city, 1);
                acc.push({
                    city: item.city,
                    count: 1,
                });
            }

            return acc;
        }, [] as CityData[]);

        setCountryData(countryData);
        setCityData(cityData);
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateData = (start: Date, end: Date) => {
        const filteredData = locationData.filter((data) => {
            const date = new Date(data.date);
            return date >= start && date <= end;
        });

        showData(filteredData);
    }

    useEffect(() => {
        updateData(startDate, endDate);
    }, [startDate, endDate]);

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
                <LocationTable
                    title="Country"
                    data={countryData}
                    loading={loading}
                    isEmpty={isEmpty}
                />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <LocationTable
                    title="City"
                    data={cityData}
                    loading={loading}
                    isEmpty={isEmpty}
                />
            </TabPanel>
        </Paper>
    );
};

export default LinkLocations;

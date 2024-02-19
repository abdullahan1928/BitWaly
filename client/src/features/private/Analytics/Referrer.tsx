import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import AnalyticsCard from "@/features/private/Analytics/AnalyticsCard";
import { fetchReferrers } from "@/services/analyticsSummary";
import { useEffect, useState } from "react";
import { authToken } from "@/config/authToken";

const Referrer = () => {
    const [referrerData, setReferrerData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (authToken !== null) {
                    const response = await fetchReferrers(authToken);
                    setReferrerData(response);
                }
            } catch (error) {
                console.error('Error fetching referrer data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalyticsCard title="Clicks & scans by Referrers">
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        type: 'column',
                        height: 300,
                    },
                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: referrerData.map((data) => data.referrer),
                        crosshair: true,
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '',
                        },
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat:
                            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y} engagements</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true,
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.001,
                        },
                    },
                    series: [
                        {
                            name: 'Referrer',
                            data: referrerData.map((data) => ({
                                name: data.referrer,
                                y: data.count,
                            })),
                            color: '#E33E7F',
                            showInLegend: false,
                        },
                    ],
                }}
            />
        </AnalyticsCard>
    );
};

export default Referrer;

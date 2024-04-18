import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import AnalyticsCard from "@/features/private/Analytics/AnalyticsCard";
import { fetchReferrersWithAdmin } from '@/services/adminAnalytics.service';
import { useEffect, useState } from "react";
import BarChartSkeleton from "../LinkDetails/LinkBarSkelton";
import { useParams } from "react-router-dom";
import { fetchReferrers } from "@/services/analyticsSummary.service";

const Referrer = () => {
    const [referrerData, setReferrerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        if (authToken === null) { return; }

        const fetchData = async () => {
            try {
                let response: any;

                if (id !== null && id !== undefined) {
                    response = await fetchReferrersWithAdmin(authToken, id);
                } else {
                    response = await fetchReferrers(authToken);
                }
                setReferrerData(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching referrer data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AnalyticsCard title="Clicks & scans by Referrers">
            {loading ? (
                <BarChartSkeleton barCount={7} width={80} />
            ) : (
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
                            categories: referrerData.map((data: any) => data.referrer),
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
                                data: referrerData.map((data: any) => ({
                                    name: data.referrer,
                                    y: data.count,
                                })),
                                color: '#E33E7F',
                                showInLegend: false,
                            },
                        ],
                    }}
                />
            )}
        </AnalyticsCard>
    );
};

export default Referrer;

import HighchartsReact from 'highcharts-react-official'
import AnalyticsCard from './AnalyticsCard'
import Highcharts from 'highcharts'
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataIE from "@highcharts/map-collection/custom/world-continents.geo.json";

highchartsMap(Highcharts);

const HeatMap = () => {

    const options = {
        chart: {
            map: 'custom/world-continents'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        mapNavigation: {
            enabled: true
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.freq}</b><br><b>{point.keyword}</b>                      <br>lat: {point.lat}, lon: {point.lon}'
        },
        series: [{
            name: 'Basemap',
            mapData: mapDataIE,
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        },]
    }

    if (typeof window !== "undefined") {
        proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 " +
            "+k=0.9996012717 +x_0=400000 +y_0=-100000 " +
            "+ellps=airy +datum=OSGB36 +units=m +no_defs");
        Highcharts.maps["countries/ie/ie-all"] = mapDataIE;
    }


    return (
        <AnalyticsCard title="Clicks + scans by location">

            <HighchartsReact
                constructorType={'mapChart'}
                highcharts={Highcharts}
                options={options}
            />

        </AnalyticsCard>
    )
}

export default HeatMap
async function drawLineChart(){
    // 1. Access data
    const dataset = await d3.json('../../data/nyc_weather_data.json');

    const yAccessor = (d) => d.temperatureMax;
}

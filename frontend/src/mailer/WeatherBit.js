import axios from 'axios';
import moment from 'moment';

const getTodaysDate = () => moment().format('YYYY-MM-DD');
const getYesterdaysDate = () =>
    moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD');

const BASE_URL = 'https://api.weatherbit.io/v2.0/';
const API_KEY = '30d5f86be0fa441d87e87d9f7784909a';

const instance = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
        units: 'I',
        country: 'US'
    }
});

/**
 * Gets weather data from WeatherBit for the current city
 * @param {String} city City
 */
const getCurrentWeather = async city => {
    const res = await instance.get('/current', {
        params: { city }
    });
    const data = res.data;
    return data.data[0];
};


/**
 * Gets yesterday's weather data from WeatherBit for the current city
 * @param {String} city City
 */
const getHistoricalWeather = async city => {
    const res = await instance.get('/history/daily', {
        params: { city, start_date: getYesterdaysDate(), end_date: getTodaysDate() }
    });
    const data = res.data;
    return data.data[0];
};

/**
 * Gets today's weather update for current city
 * Checks local cache first
 * Checks redis cache second
 * If no match found, queries new data from weatherbit
 * @param {String} city City
 */
export const getWeatherStatus = async city => {
    const todaysDate = getTodaysDate();

    // If not, fetch fresh new data
    const [current, historical] = await Promise.all([getCurrentWeather(city), getHistoricalWeather(city)]);

    // Calculate data of interest
    const tempDiff = current.temp - (historical.max_temp - historical.min_temp) / 2;
    const isSunny = current.weather.code >= 800 && current.weather.code <= 803;
    const isRainy = current.weather.code >= 200 && current.weather.code <= 623;

    // Construct object
    const result = {
        city,
        date: todaysDate,
        temp: current.temp,
        tempDiff,
        isSunny,
        isRainy,
        iconCode: current.weather.icon
    };


    // Return newly computed data
    return result;
};
import redis from 'redis';
import { promisify } from 'util';
import moment from 'moment';

/**
 * @typedef {Object} CurrentWeatherData
 * @property {String} cityWeather.city City this weather data is about
 * @property {String} cityWeather.date When the data was computed
 * @property {Number} cityWeather.temp Current temperature
 * @property {Number} cityWeather.tempDiff Difference between current weather and historical weather
 * @property {Boolean} cityWeather.isSunny True if its sunny
 * @property {Boolean} cityWeather.isRainy True if its rainy
 * @property {String} cityWeather.iconCode Weatherbit icon code
 */

const getTodaysDate = () => moment().format('YYYY-MM-DD');

const client = redis.createClient('redis://redis:6379');
const getAsync = promisify(client.get).bind(client);

const cache = {};

/**
 * Checks local or redis cache for todays weather data
 * @param {String} city
 * @returns {CurrentWeatherData | null} null if not present of data is old
 */
const getCityWeather = async city => {
    // Check local cache if we have data
    if (cache[city] && cache[city].date === getTodaysDate()) {
        console.log(`[L-Cache hit]: ${city}`); // Local Cache
        return cache[city];
    }

    // Check redis cache
    const dataString = await getAsync(`weather:${city}`);
    if (dataString !== null) {
        console.log(`[R-Cache hit]: ${city}`); // Redis Cache
        return JSON.parse(dataString);
    }
    return null;
};

/**
 * Adds computed data into local cache and redis cache
 * @param {CurrentWeatherData} cityWeather Weather object
 */
const cacheCityWeather = cityWeather => {
    cache[cityWeather.city] = cityWeather;
    client.set(`weather:${cityWeather.city}`, JSON.stringify(cityWeather), redis.print);
};

export default {
    getCityWeather,
    cacheCityWeather
};
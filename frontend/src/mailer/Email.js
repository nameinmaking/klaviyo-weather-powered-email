import React from 'react';

/**
 * Gives the appropriate email subject according to the specified params
 * @param {Object} weather
 * @param {Object} weather.tempDiff Difference in temp between today and historical temp
 * @param {Object} weather.isSunny Is it sunny today?
 * @param {Object} weather.isRainy Is it rainy today?
 */
export const getSubject = ({ tempDiff, isSunny, isRainy }) => {
    if (tempDiff >= 5 || isSunny) return 'It is nice out! Enjoy a discount on us';
    if (tempDiff <= -5 || isRainy) return 'Not so nice out? That is okay, enjoy a discount on us';
    return 'Enjoy a discount on us';
};

/**
 * Gives a JSX React Template for the email
 * @param {Object} weather
 * @param {Object} weather.city City
 * @param {Object} weather.temp Temperature
 * @param {Object} weather.iconCode Weatherbit icon code
 * @returns {JSX}
 */
export const Email = ({ city, temp, iconCode }) => {
    return (
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" />
        </head>
        <body>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="d-inline-flex p-2">
                        <h1>Hello!</h1>
                        <div>
                            <p>
                                Its currently {temp} in {city}
                            </p>
                        </div>
                        <img src={`https://www.weatherbit.io/static/img/icons/${iconCode}.png`} />
                    </div>
                </div>
            </div>
        </div>
        </body>
        </html>
    );
};
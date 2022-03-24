const request = require('postman-request');

const forecast = (long, lat, callback) => {

    const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=38bd803ce88430f73d7ca134e66b5c6b&units=metric'

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (response.body.cod == 400) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, response.body.name + ' It is currently ' + response.body.main.temp + ' degress out. There is a ' + response.body.main.humidity + '% chance of rain.')   
        }
    })
}

module.exports = forecast

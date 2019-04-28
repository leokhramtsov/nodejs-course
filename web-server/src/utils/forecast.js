const request = require('request');

const forecast = (latitude, longitude, cb) => {
  const url = `https://api.darksky.net/forecast/${
    process.env.DS_API_KEY
  }/${latitude},${longitude}?units=si`;

  request({ url, json: true }, (error, response, body) => {
    if (error) {
      cb('Unable to connect to weather service!', undefined, undefined);
    } else if (body.error) {
      cb('Unable to find a location.', undefined, undefined);
    } else if (response.statusCode !== 200) {
      cb(response.statusMessage, undefined, undefined);
    } else {
      const { temperature, precipProbability, icon } = body.currently;
      const dailySummary = body.daily.data[0].summary;

      cb(
        undefined,
        icon,
        `${dailySummary} It is currently ${temperature} C degrees out. There is a ${precipProbability *
          100}% chance of precipitation.`
      );
    }
  });
};

module.exports = forecast;

const request = require('request');

const geocode = (query, cb) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

  request({ url, json: true }, (error, response, body) => {
    if (error) {
      cb('Unable to connect to location service!', undefined);
    } else if (body.message) {
      cb(body.message, undefined);
    } else if (!body.features.length) {
      cb('Unable to find a location. Try another search.', undefined);
    } else {
      cb(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name
      });
    }
  });
};

module.exports = geocode;

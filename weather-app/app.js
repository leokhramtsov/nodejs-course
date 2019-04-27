require('dotenv').config();
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const query = process.argv[2];

if (!query) {
  console.log('Please provide a search query');
} else {
  geocode(query, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log(error);
    }

    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return console.log(error);
      }

      console.log(location);
      console.log(data);
    });
  });
}

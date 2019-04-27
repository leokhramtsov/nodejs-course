require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirPath));

app.get('/', (req, res) => {
  res.render('index', { title: 'Weather App', name: 'Leo Khramtsov' });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    message: 'Testing about route',
    name: 'Leo Khramtsov'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'Testing help route',
    name: 'Leo Khramtsov'
  });
});

app.get('/weather', (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({ error: 'You must provide an address.' });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return res.send({ error });
      }

      res.send({ location, data });
    });
  });
});

app.get('/help/*', (req, res) => {
  res
    .status(404)
    .render('notFound', { title: '404', message: 'Help page not found.' });
});

app.use((req, res, next) => {
  res
    .status(404)
    .render('notFound', { title: '404', message: 'Page not found.' });
});

app.listen(3000, () => console.log('Server is up on port 3000.'));

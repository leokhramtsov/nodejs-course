const inputSearch = document.querySelector('input.search');
const buttonSubmit = document.querySelector('button[type="submit"]');
const locationDiv = document.querySelector('.location');
const forecastDiv = document.querySelector('.forecast');

const fetchWeather = e => {
  e.preventDefault();
  const address = inputSearch.value;

  locationDiv.textContent = 'Searching...';
  forecastDiv.textContent = '';

  fetch(`/weather?address=${address}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        locationDiv.textContent = data.error;
        inputSearch.value = '';
      } else {
        const skycons = new Skycons({ color: '#f2d1c9' });
        console.log(data);

        skycons.add(document.getElementById('icon'), data.icon);
        skycons.play();
        locationDiv.textContent = data.location;
        forecastDiv.textContent = data.data;
        inputSearch.value = '';
      }
    })
    .catch(error => console.error(error));
};

buttonSubmit.addEventListener('click', fetchWeather);

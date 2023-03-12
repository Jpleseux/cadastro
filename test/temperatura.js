const axios = require('axios');
const API_KEY = '4acd9e66152bc9199e1ea839d12a0e61';
const CITY = 'São Paulo';
const COUNTRY_CODE = 'BR';

axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}`)
  .then(response => {
    const weatherData = response.data;
    const temperature = Math.round(weatherData.main.temp - 273.15); // convert Kelvin to Celsius
    console.log(`A temperatura em ${CITY}, ${COUNTRY_CODE} é de ${temperature} °C.`);
  })
  .catch(error => {
    console.log(error);
  });

"use strict"
var mod = ( function(){
  var weatherData;

  var tempDisplayEl   = document.querySelector('#temp-display');
  var weatherIconImg  = document.querySelector('.weather-icon');
  var dateEl          = document.querySelector('#date');
  var dayEl           = document.querySelector('#day');
  var unitToggleBtn   = document.querySelector('#unit-toggle');

  function checkGeolocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(success, fail);
    } else {
      return console.log('geolocation unavailable');
    }

    function success(position) {
      var lon = position.coords.longitude;
      var lat = position.coords.latitude;
      return startRequest(lon, lat);
    }

    function fail(msg) {
      console.log(msg.message);
      console.log('err');
    }
  }

  function startRequest(lon, lat) {
    var endpoint = `https://api.apixu.com/v1/forecast.json?key=a2a31a32926644e8b7052519170905&q=${lat},${lon}&days=7`; // returns error 403

    return ajaxRequest(endpoint)
      .then(function(val){
        weatherData = val;
        displayLocation(weatherData.location);
        displayForecastF(
          weatherData.current.temp_f,
          weatherData.forecast.forecastday[0].day.mintemp_f,
          weatherData.forecast.forecastday[0].day.maxtemp_f,
        );
        displayImg(weatherData.current.condition.icon);
      })
      .then( function(){
        displayDate();
        unitToggleBtn.style.display = "block";
      } )
      .catch(function(err){
        console.log(err);
      });
  }

  function ajaxRequest(url) {
    return new Promise( function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = dataHandler;

      function dataHandler() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          var data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject('err');
        }
      }
      xhr.send();
    } );
  }

  function displayLocation(locationObj = {}) {
    var locationEl = document.querySelector('#location');
    var city = locationObj.name;
    var region = locationObj.region;
    return locationEl.textContent = `${city}, ${region}`;
  }

  function displayForecastF(current, min, max) {
    return tempDisplayEl.innerHTML = `
      ${parseInt(current)}&degF <br>
      ${parseInt(min)}&degF / ${parseInt(max)}&degF
    `
  }

  function displayForecastC(current, min, max) {
    return tempDisplayEl.innerHTML = `
      ${parseInt(current)}&degC <br>
      ${parseInt(min)}&degC / ${parseInt(max)}&degC
    `
  }

  function displayImg(img) {
    var imgPath = img.replace('//cdn.apixu.com/weather', '');
    return weatherIconImg.setAttribute('src', `img${imgPath}`);
  }

  function displayDate() {
    var months = [ 'January', 'Feburary', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',  'Friday', 'Saturday' ];

    var currentDate = new Date();

    dateEl.innerHTML = `${months[currentDate.getMonth()]}
    ${currentDate.getUTCDate()}`;

    dayEl.innerHTML = `${days[currentDate.getDay()]}`;
  }

  var isCel = false;
  function toggleUnit() {
    if (isCel) {
      displayForecastF(
        weatherData.current.temp_f,
        weatherData.forecast.forecastday[0].day.mintemp_f,
        weatherData.forecast.forecastday[0].day.maxtemp_f,
      );
      unitToggleBtn.innerHTML = '&degC';
    } else {
      displayForecastF(
        weatherData.current.temp_c,
        weatherData.forecast.forecastday[0].day.mintemp_c,
        weatherData.forecast.forecastday[0].day.maxtemp_c,
      );
      unitToggleBtn.innerHTML = '&degF';
    }
    return isCel = !isCel;
  }

  return {
    convert: function() {
      return unitToggleBtn.addEventListener('click', toggleUnit);
    },
    locate: function() {
      return checkGeolocation();
    }
  }
} )();
mod.convert();
mod.locate();

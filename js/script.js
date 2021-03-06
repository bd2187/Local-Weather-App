"use strict"

var mod = ( function(){
  var weatherData;

  var loaderEl          = document.querySelector('.loader');
  var currentDisplayEl  = document.querySelector('#currentTemp-display');
  var minMaxDisplayEl   = document.querySelector('#minMaxTemp-display');
  var weatherIconImg    = document.querySelector('.weather-icon');
  var dateEl            = document.querySelector('#date');
  var dayEl             = document.querySelector('#day');
  var unitToggleBtn     = document.querySelector('#unit-toggle');

  function checkGeolocation() {
    function success(position) {
      var lon = position.coords.longitude;
      var lat = position.coords.latitude;
      console.log(lon, lat);
      return startRequest(lon, lat);
    }

    function fail(msg) {
      /*  DISPLAY ERROR MESSAGE IN BROWSER VIEWPORT*/
      console.log(msg.message);
      console.log('err');
    }

    return navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(success, fail)
      : console.log('geolocation unavailable');
  }

  function startRequest(lon, lat) {
    var endpoint = `https://api.apixu.com/v1/forecast.json?key=a2a31a32926644e8b7052519170905&q=${lat},${lon}&days=7`;

    return ajaxRequest(endpoint) //request data from location api
      .then(function(val){
          weatherData = val;
          console.log(val);
          displayLocation(weatherData.location);
          displayForecastF(
            weatherData.current.temp_f,
            weatherData.forecast.forecastday[0].day.mintemp_f,
            weatherData.forecast.forecastday[0].day.maxtemp_f,
          );
          displayImg(weatherData.current.condition.icon);
          changeBG(weatherData.current.condition.icon);
        })
        .then( function(){
          displayDate();
          unitToggleBtn.style.display = "block";
        } )
        .catch(function(err){
          console.log(err);
        });
  }

  // Promise utility
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
    var currentTemp = parseInt(current);
    var minTemp = parseInt(min);
    var maxTemp = (function maxTemp() {
      // If current temperature > predicted max temperature, maxTemp = current temperature
      return currentTemp >= parseInt(max) ? currentTemp : parseInt(max)
    })();


    currentDisplayEl.innerHTML = `${currentTemp}&degF`;
    minMaxDisplayEl.innerHTML = `${minTemp}&degF / ${maxTemp}&degF`;
  }

  function displayForecastC(current, min, max) {
    var currentTemp = parseInt(current);
    var minTemp = parseInt(min);
    var maxTemp = (function maxTemp() {
      // If current temperature > predicted max temperature, maxTemp = current temperature
      return currentTemp >= parseInt(max) ? currentTemp : parseInt(max)
    })();


    currentDisplayEl.innerHTML = `${currentTemp}&degC`;
    minMaxDisplayEl.innerHTML = `${minTemp}&degC / ${maxTemp}&degC`;
  }

  function displayImg(img) {
    var imgPath = img.replace('//cdn.apixu.com/weather', '');
    return weatherIconImg.setAttribute('src', `img${imgPath}`);
  }

  function changeBG(condition) {
    var containerEl = document.querySelector('.container');
    if ( condition.includes('day') ) {
      containerEl.classList.add('dayBG');
      unitToggleBtn.classList.add('dayBG');
    } else if ( condition.includes('night') ){
      containerEl.classList.add('nightBG');
      unitToggleBtn.classList.add('nightBG');
    } else {
      containerEl.classList.add('dayBG');
      unitToggleBtn.classList.add('dayBG');
    }
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
      displayForecastC(
        weatherData.current.temp_c,
        weatherData.forecast.forecastday[0].day.mintemp_c,
        weatherData.forecast.forecastday[0].day.maxtemp_c,
      );
      unitToggleBtn.innerHTML = '&degF';
    }
    return isCel = !isCel;
  }

  return {
    checkGeolocation: checkGeolocation,
    unitToggleBtn: unitToggleBtn.addEventListener('click', toggleUnit),
  }
})();

mod.checkGeolocation();
mod.unitToggleBtn;

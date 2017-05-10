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

  function startRequest() {
    var location = 'http://ip-api.com/json/';
    var endpoint;

    return ajaxRequest(location) //request data from location api
      .then( function(val){
        endpoint = `https://api.apixu.com/v1/forecast.json?key=a2a31a32926644e8b7052519170905&q=${val.lat},${val.lon}&days=7`
        return ajaxRequest(endpoint) // after location, request weather
      } )
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
    currentDisplayEl.innerHTML = `${parseInt(current)}&degF`;
    minMaxDisplayEl.innerHTML = `${parseInt(min)}&degF / ${parseInt(max)}&degF`;
  }

  function displayForecastC(current, min, max) {
    currentDisplayEl.innerHTML = `${parseInt(current)}&degC`;
    minMaxDisplayEl.innerHTML = `${parseInt(min)}&degC / ${parseInt(max)}&degC`;
  }

  function displayImg(img) {
    var imgPath = img.replace('//cdn.apixu.com/weather', '');
    return weatherIconImg.setAttribute('src', `img${imgPath}`);
  }

  function changeBG(condition) {
    var containerEl = document.querySelector('.container');
    if ( condition.includes('day') ) {
      return containerEl.classList.add('dayBG');
    } else if ( condition.includes('night') ){
      return containerEl.classList.add('nightBG');
    } else {
      return containerEl.classList.add('defaultBG');
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
    startRequest: startRequest,
    unitToggleBtn: unitToggleBtn.addEventListener('click', toggleUnit),
  }
})();

mod.startRequest();
mod.unitToggleBtn;

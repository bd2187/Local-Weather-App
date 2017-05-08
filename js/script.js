if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(success, fail);

} else {

  console.log('geolocation unavailable');

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

function startRequest(lon, lat) {
  var endpoint = `https://api.apixu.com/v1/forecast.json?key=82c329cc3bd840c9af4214023170305&q=${lat},${lon}&days=7`;

  return ajaxRequest(endpoint)
    .then(function(val){
      console.log(val);
    })
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

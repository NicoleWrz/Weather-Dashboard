let apiKey = "d1eb7ebd43f759fd8893dc27cdfd251e";
let oneCallAPIKey = "872d8e1363e835e7e9e7bf016311f721";
let searchBtn = document.querySelector(".searchBtn");
let searchBox = document.querySelector("#search-box");
let cityName;
let weatherContainer = document.querySelector(".weather-container");

searchBtn.addEventListener("click",function () {
    event.preventDefault();
    cityName = searchBox.value;
    getWeather();
})

function showTemp(temperature) {
    var tempEl = document.createElement("h4");
    tempEl.textContent = temperature;
    weatherContainer.append(tempEl);
}
function showHumidity(humidity){
    var humidityEl = document.createElement("h4");
    humidityEl.textContent = humidity;
}
function showWind(windSpeed){
    var windEl = document.createElement("h4");
    windEl.textContent = windSpeed;
}
function showUvi(uvi){
    var uviEl = document.createElement("h4");
    uviEl.textContent = uvi;
}

function getWeather() {
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("data", data);
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&appid=" + oneCallAPIKey)
            .then(function (latAndLon) {
                return latAndLon.json();
            })
            .then(function (weather) {
                console.log("weather", weather);
                let temperature = ((weather.current.temp - 273.15) * 9 / 5 + 32);
                let humidity = weather.current.humidity;
                let windSpeed = weather.current.wind_speed;
                let uvi = weather.current.uvi;
        
                showTemp(temperature);
                showHumidity(humidity);
                showWind(windSpeed);
                showUvi(uvi);
            })
    });
}


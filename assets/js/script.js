const apiKey = "d1eb7ebd43f759fd8893dc27cdfd251e";
const oneCallAPIKey = "872d8e1363e835e7e9e7bf016311f721";
let searchBtn = document.querySelector(".search-btn");
let searchBox = document.querySelector("#search-box");
let cityName;
let weatherContainer = document.querySelector(".weather-container");
let futureForcast = document.querySelector(".future-forcast");

displayHistory();

searchBtn.addEventListener("click",function () {
    event.preventDefault();
    cityName = searchBox.value;
    weatherContainer.innerHTML="";
    futureForcast.innerHTML="";
    getWeather();

    let storedHistory = JSON.parse(localStorage.getItem("history")) || [];

    storedHistory.push(cityName);
    localStorage.setItem("history", JSON.stringify(storedHistory));

    displayHistory();
})

var today = moment();
$(".current-date").text(today.format("MMMM Do, YYYY"));

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    for (let i = 0; i < history.length;i++) {
        let historyEl = document.createElement("li");
        historyEl.textContent = history[i];
        document.querySelector(".history").append(historyEl);
    }
}

function showTemp(temperature) {
    let tempEl = document.createElement("h5");
    tempEl.textContent = "Temperature: " + temperature.toFixed(2) + "°F";
    weatherContainer.append(tempEl);
}
function showHumidity(humidity){
    let humidityEl = document.createElement("h5");
    humidityEl.textContent = "Humidity: " + humidity + " %";
    weatherContainer.append(humidityEl);
}
function showWind(windSpeed){
    let windEl = document.createElement("h5");
    windEl.textContent = "Wind Speed: " + ((windSpeed * 2.236936).toFixed(2)) + "MPH";
    weatherContainer.append(windEl);
}
function showUvi(uvIndex){
    let uviEl = document.createElement("h5");
    uviEl.textContent = "UV Index: " + uvIndex;
    weatherContainer.append(uviEl);
    if (uvIndex <= 2) {
        uviEl.classList.add("low");
    }
    else if (uvIndex >= 3 && uvIndex <= 5) {
        uviEl.classList.add("moderate");
    }
    else {
        uviEl.classList.add("severe")
    }
}

function getFiveDayForecast(daily) {
    for (let i = 1; i < 6; i++) {
        console.log((daily[i].temp.day - 273.15) * 9 / 5 + 32);
        console.log(daily[i].humidity);
        console.log(daily[i].wind_speed);
        console.log(daily[i].weather[0].icon);

        let fiveDayDiv = document.createElement("div");
        fiveDayDiv.classList.add("five-day");

        let fiveDayTempEl = document.createElement("h4");
        let fiveDayTemp = (daily[i].temp.day - 273.15) * 9 / 5 + 32;
        fiveDayTempEl.textContent = fiveDayTemp.toFixed(2);
        fiveDayTempEl.textContent = "Temperature: " + fiveDayTemp.toFixed(2) + " °F";
        fiveDayDiv.append(fiveDayTempEl);

        let fiveDayHumidity = document.createElement("p");
        fiveDayHumidity.textContent = daily[i].humidity;
        fiveDayHumidity.textContent = "Humidity: " + daily[i].wind_speed + " %";
        fiveDayDiv.append(fiveDayHumidity);

        let fiveDayWind = document.createElement("p");
        fiveDayWind.textContent = daily[i].wind_speed;
        fiveDayWind.textContent = "Wind Speed: " + daily[i].wind_speed + " MPH";
        fiveDayDiv.append(fiveDayWind);

        let fiveDayIcon = document.createElement("img");
        fiveDayIcon.src = "https://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png";
        fiveDayDiv.append(fiveDayIcon);

        futureForcast.append(fiveDayDiv);
    }
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
                let icon = weather.current.weather[0].icon;
                console.log(icon)
        
                showTemp(temperature);
                showHumidity(humidity);
                showWind(windSpeed);
                showUvi(uvi);

                getFiveDayForecast(weather.daily);
            })
    });
}
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function displayForecast(response) {
  let forecastDaysElement = document.querySelector("#forecast-days");
  let forecastIconsElement = document.querySelector("#forecast-icons");
  let forecastTemperaturesElement = document.querySelector(
    "#forecast-temperatures"
  );

  let forecastDaysHTML = "";
  let forecastIconsHTML = "";
  let forecastTemperaturesHTML = "";

  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  response.data.daily.slice(1, 6).forEach(function (dayForecast) {
    let day = days[new Date(dayForecast.dt * 1000).getDay()];
    forecastDaysHTML += `<div class="col">${day}</div>`;
    forecastIconsHTML += `<div class="col">
      <img src="http://openweathermap.org/img/wn/${dayForecast.weather[0].icon}.png" alt="" />
    </div>`;
    forecastTemperaturesHTML += `<div class="col">
      <span class="temp-max">${Math.round(dayForecast.temp.max)}°</span>
      <span class="temp-min">${Math.round(dayForecast.temp.min)}°</span>
    </div>`;
  });

  forecastDaysElement.innerHTML = forecastDaysHTML;
  forecastIconsElement.innerHTML = forecastIconsHTML;
  forecastTemperaturesElement.innerHTML = forecastTemperaturesHTML;
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let descriptionElement = document.querySelector("#description");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon-today");

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.weather[0].description;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    displayForecast(response.data.daily);
  });
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}&units=metric&cnt=6`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  searchCity(cityInputElement.value);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let celsiusTemperature = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemperature.innerHTML * 9) / 5 + 32; // Fix the typo "documnet" to "document"
  celsiusTemperature.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let celsiusTemperature = document.querySelector("#temperature");
  celsiusTemperature.innerHTML = Math.round(celsiusTemperature.innerHTML);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

displayForecast();
searchForm.addEventListener("submit", handleSubmit);
searchCity("Paris");

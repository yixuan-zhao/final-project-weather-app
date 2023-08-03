function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

function displayForecast(forecast) {
  let forecastDaysElement = document.querySelector("#forecast-days");
  let forecastIconsTemperaturesElement = document.querySelector(
    "#forecast-icons-temperatures"
  );

  let forecastDaysHTML = "";
  let forecastIconsTemperaturesHTML = "";

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forecast.slice(1, 6).forEach(function (dayForecast) {
    let day = days[new Date(dayForecast.dt * 1000).getDay()];
    forecastDaysHTML += `<div class="col">${day}</div>`;

    forecastIconsTemperaturesHTML += `<div class="col">
      <img src="http://openweathermap.org/img/wn/${
        dayForecast.weather[0].icon
      }@2x.png" alt="" />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">${Math.round(
          dayForecast.temp.max
        )}°</span>
        <span class="weather-forecast-temperature-min">${Math.round(
          dayForecast.temp.min
        )}°</span>
      </div>
    </div>`;
  });

  forecastDaysElement.innerHTML = forecastDaysHTML;
  forecastIconsTemperaturesElement.innerHTML = forecastIconsTemperaturesHTML;
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
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
  // celsiusLink.classList.add("active");
  // fahrenheitLink.classList.remove("active");
  let celsiusTemperature = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

displayForecast();

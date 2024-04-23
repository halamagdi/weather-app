const WeatherLocation = document.querySelector(".location"),
  degreeNumber = document.querySelector(".deg-num"),
  degreeIcon = document.querySelector(".deg-icon"),
  weatherDescription = document.querySelector(".weather-desc"),
  search = document.querySelector(".searchBox"),
  currentDay = document.querySelector(".currentDay"),
  currentMonth = document.querySelector(".currentMonth"),
  humidity = document.querySelector(".humidity"),
  windSpeed = document.querySelector(".wind"),
  compass = document.querySelector(".compass");

let currentDate = new Date();
let data;
// next day variables
const nextDay = document.querySelectorAll(".nextDay"),
  maxDegree = document.querySelectorAll(".maxDegree"),
  minDegree = document.querySelectorAll(".minDegree"),
  nextDesc = document.querySelectorAll(".next-desc"),
  nextIcon = document.querySelectorAll(".next-icon");

async function getWeatherApi(loc) {
  let result = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=67e1aa1afde7424697175449241404&q=${loc}&days=3`
  );
  if (result.ok && result.status !== 400) {
    data = await result.json();
    displayCurrentDegree();
    displayNextDegrees();
  }
}
search.addEventListener("keyup", (e) => {
  getWeatherApi(e.target.value);
});
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function displayCurrentDegree() {
  currentDay.innerHTML = days[currentDate.getDay()];
  currentMonth.innerHTML =
    currentDate.getDate() + months[currentDate.getMonth()];

  WeatherLocation.innerHTML = data.location.name;
  degreeNumber.innerHTML = data.current.temp_c + "°C ";
  degreeIcon.setAttribute("src", `https://${data.current.condition.icon}`);
  weatherDescription.innerHTML = data.current.condition.text;
  humidity.innerHTML = data.current.humidity + "%";
  windSpeed.innerHTML = data.current.wind_kph + " km/h";
  compass.innerHTML = data.current.wind_dir;
}
function getNextDays(nextDateApi) {
  let nextDate = new Date(nextDateApi);
  return days[nextDate.getDay()];
}

function displayNextDegrees() {
  for (let i = 0; i < nextDay.length; i++) {
    let nextDateApi = data.forecast.forecastday[i + 1].date;

    nextDay[i].innerHTML = getNextDays(nextDateApi);
    nextIcon[i].setAttribute(
      "src",
      `https://${data.forecast.forecastday[i + 1].day.condition.icon}`
    );
    maxDegree[i].innerHTML =
      data.forecast.forecastday[i + 1].day.maxtemp_c + "°C ";
    minDegree[i].innerHTML =
      data.forecast.forecastday[i + 1].day.mintemp_c + "°C ";
    nextDesc[i].innerHTML = data.forecast.forecastday[i + 1].day.condition.text;
  }
}

// current user location

(function () {
  const successCallback = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    await fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const cityName =
          data.address.city ||
          data.address.town ||
          data.address.locality ||
          "Unknown";
        getWeatherApi(cityName);
      })
      .catch((error) => {
        console.error("Error fetching geolocation data:", error);
      });
  };

  const errorCallback = (error) => {
    console.error("Error getting geolocation:", error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
})();

// getWeatherApi("giza");



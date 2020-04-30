const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

const searchElement = document.querySelector(".search");
const searchBox = document.querySelector(".search-box");
const searchButton = document.querySelector(".search-button");

const weather = {};
weather.temperature = {
    // value = 
    unit : "celsius"
}

const KELVIN = 273;
const CELSIUS = KELVIN - 273;
//API kEY
const key = "3c9686c88bcef13840e4b06151909ee9";


if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does't support geoloction</p>";
}

// 
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude,longitude);
}

// show error messages in the notificationElement
function showError(error){
    searchElement.style.display = "block";
    notificationElement.style.display = "block";
    if (error.code == 2) {
        notificationElement.innerHTML = `<p>Couldn't get current location</p>`;  
    } else {
        notificationElement.innerHTML = `<p> ${error.message} </p>`;  
    }
}

function getWeather(latitude, longitude, search = null){
    let baseURL = `http://api.openweathermap.org/data/2.5/weather?APPID=${key}`;
    let suffix = `lat=${latitude}&lon=${longitude}`;
    
    if (search) {
        suffix = `q=${search}`;
    }
    
    api = `${baseURL}&${suffix}`
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Loading...</p>";
    
    fetch(api).then(function(response){
        let data = response.json();
        return data;
    }).then(function(data){
        if (data.cod == 200) {
            // weather.temperature.value = Math.floor(data.main.temp - (KELVIN-273));
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            notificationElement.style.display = "none";
        } else {
            notificationElement.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .then (function(){
        displayWeather();
    });
    
}
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`; 
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;  
    descElement.innerHTML = weather.description;  
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;  
}
function celsiusToFahrenheit(temperature){  
    return (temperature * 9/5) + 32;  
}  
    
tempElement.addEventListener("click",function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        weather.temperature.unit = "celsius";
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    }
});


searchButton.addEventListener("click", function() {
    let val = searchBox.value;
    if (val != "") {
        getWeather("", "", val);
    }
});
notificationElement.style.display = "block";
notificationElement.innerHTML = "<p>Loading...</p>";
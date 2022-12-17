// Global Variables
var userFormEl = document.querySelector('#user-form');
var recentButtonsEl = document.querySelector('#recent-buttons');
var cityInputEl = document.querySelector('#city-name');
var resultsContainerEl = document.querySelector('#results-container');
var resultsSearchTerm = document.querySelector('#results-search-term');

var APIKey = "f57655fbf21b91dc4e4940b14a581a26"; //default API key
var city = "Brisbane" //FIXME: update based on cityInputEl.value
var limit = 5; //FIXME: how many results to return from the city name list
//get City Lat and Long
var lat = -27.4679; //Brisbane
var lon = 153.0281; //Brisbane

//OpenWeather Request URLS
var requestCityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + limit + "&appid=" + APIKey;
var requestLocationURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

//get weather api

console.log(requestCityURL);

var getCurrentWeather = function (name) {
    
    fetch(requestCityURL)
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        console.log(data);  
    });
    
  };

var currentWeatherSection = function(cityName) {
    // get and use data from open weather current weather api end point
    fetch(requestLocationURL)
        // get response and turn it into objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's longitude and latitude
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            console.log(cityLon);
            console.log(cityLat);
            console.log(requestLocationURL);
        })
};




getCurrentWeather();
currentWeatherSection();
//user inputs a city name
//user selects the submit button
//users search appears in recent searches section
//city name appear in resultsSearchTerm
//city weather stats appear in resultsContainerEl
//5 day forecast appears under resultsContainerEl
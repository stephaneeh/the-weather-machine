// Global Variables
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var recentButtonsEl = document.querySelector('#recent-buttons');
var resultsContainerEl = document.querySelector('#results-container');
var searchResults = document.querySelector('#search-results');
var weeklyForecast = document.querySelector('.weekly-forecast');
var dailyCards = document.querySelector('.daily-cards');
var today = dayjs().format("ddd DD MMM, YYYY");
// USER INPUT RESULTS
var cityName = "Brisbane"; //FIXME: update based on cityInputEl.value
var resultsCount = 56;
var baseCityURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

var limit = 1; //FIXME: how many results to return from the city name list
var units = "metric";

//OpenWeather Request variables
var APIKey = "f57655fbf21b91dc4e4940b14a581a26"; //default API key
var baseCityURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

// var baseFullURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&cnt=" + resultsCount + "&appid=" + APIKey + "&units=" + units;

var getTodaysWeather = function () {

    var queryCurrentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey + "&units=" + units;
        fetch(queryCurrentURL)
            .then(function (response) {
            response.json().then(function (data) {
            console.log(data);
        })
    })
}


var getWeatherResults = function() {
    fetch(baseCityURL)
            .then(function (response) {
            response.json().then(function (data) {
            console.log(data);

            var cityLat = data.city.coord.lat;
            var cityLon = data.city.coord.lon;

            console.log(cityLat + ", " + cityLon); //TODO: remove at the end

            var baseFullURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=" + units;
            console.log(baseFullURL); //TODO: remove at the end

                fetch(baseFullURL)
                    .then(function (response) {
                    response.json().then(function (data) {
                    console.log(data);

                    for (var i = 0; i < baseFullURL.length; i++) {
                        let dateBlock = data.list[i].dt_txt.split(' ')[0];
                        let timeBlock = data.list[i].dt_txt.split(' ')[1];
                        if (timeBlock == "00:00:00") {
                            var results = [
                                "date: " + dateBlock,
                                "id: " + data.list[i].weather[0].id,
                                // // TODO:id: references the icon list + d and n for day and night
                                "weather: " + data.list[i].weather[0].main,
                                "temp: " +  data.list[i].main.temp + "C",
                                "humidity: " + data.list[i].main.humidity + "%",
                                "wind speed: " + data.list[i].wind.speed + "M/S",
                                ];
                           
                                console.log(results);
                                // store results in local
                            } else {
                                console.log("no results found");
                            }
                        };
                    })//response for fetch baseFullURL
                })//function for fetch baseFullURL response
            })//response for fetch baseCityURL
            })//function for fetch baseCityURL response
        }; //getWeatherResults function
    


getTodaysWeather();
getWeatherResults(); //FIXME: update to event listener on submit at end

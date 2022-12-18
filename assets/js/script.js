// Global Variables
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var recentButtonsEl = document.querySelector('#recent-buttons');
var resultsContainerEl = document.querySelector('#results-container');
var searchResults = document.querySelector('#search-results');

var today = dayjs().format("ddd DD MMM, YYYY");
// USER INPUT RESULTS
var cityName = "" //FIXME: update based on cityInputEl.value
var limit = 1; //FIXME: how many results to return from the city name list
var units = "metric";

//OpenWeather Request variables
var APIKey = "f57655fbf21b91dc4e4940b14a581a26"; //default API key

//User enters city name and submits to update search results to current city
var formSubmitHandler = function(event) {
    event.preventDefault();
    //Update cityName based on user input
    var cityName = cityInputEl.value;

    console.log(cityName);//TODO: REMOVE
    getWeather(cityName); 

}

// Fetch current weather based on user input
var getWeather = function (cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey + "&units=" + units;  
    console.log(queryURL); //TODO: REMOVE

    //FETCH city query - userd for verification TODO: remove at the end
    //might be required for 5 day forecast.... look into
    fetch(queryURL)
        .then(function (response) {
        response.json().then(function (data) {
        console.log(data);

        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;

        console.log(cityLat + ", " + cityLon); //TODO: remove at the end

        var queryFullURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=" + units;  
        console.log(queryFullURL); //TODO: remove at the end)
    //fetch weather information based on user input
            fetch(queryFullURL)
                .then(function (weatherResponse) {
                    if (weatherResponse.ok) {
                        weatherResponse.json().then(function(weatherResults) {
                            //update results search term with cityname and date
                            var titleEl = document.createElement("h2");
                            titleEl.classList = "subtitle";
                            titleEl.textContent = cityName + " - " + today;
                        
                            searchResults.append(titleEl);

                            //add new div to hold weather results
                            //results of weather should now appear in results-container
                            var currentWeatherEl = document.createElement("ul");
                            resultsContainerEl.append(currentWeatherEl);

                            var currentWeatherDetails = [
                                "id: " + weatherResults.weather[0].id,
                                // id: references the icon list + d and n for day and night
                                "weather: " + weatherResults.weather[0].main,
                                "temp: " +  weatherResults.main.temp + "C",
                                "humidity: " + weatherResults.main.humidity + "%",
                                "wind speed: " + weatherResults.wind.speed + "M/S",
                                ];
                            console.log(currentWeatherDetails);

                            for (var i = 0; i < currentWeatherDetails.length; i++) {
                                var currentWeatherList = document.createElement("li");
                                currentWeatherList.textContent = currentWeatherDetails[i];
                                            //append to ul
                            currentWeatherEl.append(currentWeatherList);
                            }
                        })
                    }
                })
            })
        });
    };

// var weatherData = function (cityData) {
//     var qer
// }





// getWeather ();

//run getWeather function when submit button is clicked
//TODO: button should not run if no input entered
userFormEl.addEventListener('submit', formSubmitHandler);



//user inputs a city name
//user selects the submit button
//users search appears in recent searches section
//city name appear in resultsSearchTerm
//city weather stats appear in resultsContainerEl
//5 day forecast appears under resultsContainerEl
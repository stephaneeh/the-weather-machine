// Global Variables
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');

var recentButtonsEl = document.querySelector('#recent-buttons');

var resultsContainerEl = document.querySelector('#results-container');
var resultsSearchTerm = document.querySelector('#results-search-term');

// USER INPUT RESULTS
var cityName = "" //FIXME: update based on cityInputEl.value
var limit = 5; //FIXME: how many results to return from the city name list

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
    var queryCityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey + "&units=metric";  
    console.log(queryCityURL); //TODO: REMOVE
    //FETCH API
        fetch(queryCityURL)
            .then(function (weatherResponse) {
                if (weatherResponse.ok) {
                    weatherResponse.json().then(function(weatherResults) {
                    //results of weather should now appear in results-container
                        //add new div to hold weather results
                        var currentWeatherEl = document.createElement("div");
                        //add new heading to hold city name
                        var titleEl = document.createElement("h2");
                        titleEl.classList = "subtitle";
                        titleEl.textContent = cityName;

                        
                        // ('<h2>').text(cityName)

                        resultsContainerEl.append(currentWeatherEl);
                        currentWeatherEl.append(titleEl);

                        // currentWeatherEl.append(resultsContainerEl);
                        // currentCityEl.append(currentWeatherEl);
                    })
                }
            })
        };








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
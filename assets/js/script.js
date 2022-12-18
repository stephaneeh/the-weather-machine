// Global Variables
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var recentButtonsEl = document.querySelector('#recent-buttons');
var resultsContainerEl = document.querySelector('#results-container');
var searchResults = document.querySelector('#search-results');
var weeklyForecast = document.querySelector('.weekly-forecast');
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
    getCurrentWeather(cityName); 

}

// Fetch current weather based on user input
var getCurrentWeather = function (cityName) {
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

             //<----------- CURRENT DAY WEATHER ENDS HERE
                            //create htitle for current day forecast
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
                                // TODO:id: references the icon list + d and n for day and night
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

                            //<----------- CURRENT DAY WEATHER ENDS HERE
                            //-----------> 5 DAY FORECAST STARTS HERE (STILL WITHIN FUNCTION RESPONSE QUERY)

                            //create title for 5 day forecast
                            var weeklyTitleEl = document.createElement("h2");
                            weeklyTitleEl.classList = "subtitle";
                            weeklyTitleEl.textContent = "What do the next 5 days look like in " + cityName + "?";

                            weeklyForecast.append(weeklyTitleEl);

                            //TODO://create arry to hold next 5 days
                            var fiveDayArray = [];

                            for (var i = 0; i < 5; i++) {
                                let forecastDate = dayjs().add(i+1, 'days').format('DD/MM/YYYY');

                                fiveDayArray.push(forecastDate);
                                console.log(forecastDate); //TODO: REMOVE

                            //create 5 containers for days
                            // for (var i=0; i < forecastDate.length; i++) {
                            //     let cardEl = document.createElement("h3");
                            //     cardEl.classList = "date-card";
                            //     cardEl.textContent = forecastDate;

                            //     weeklyTitleEl.append(cardEl);

                            // }
                        }

                        })
                    }
                })
            })


        });
    };


    





//TODO: button should not run if no input entered
userFormEl.addEventListener('submit', formSubmitHandler);



//user inputs a city name
//user selects the submit button
//users search appears in recent searches section
//city name appear in resultsSearchTerm
//city weather stats appear in resultsContainerEl
//5 day forecast appears under resultsContainerEl
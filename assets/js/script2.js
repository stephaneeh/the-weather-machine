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
var cityName = ""; //FIXME: update based on cityInputEl.value
var resultsCount = 56;
var baseCityURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
var queryFullURL = "";
var baseFullURL = "";
var limit = 1; //FIXME: how many results to return from the city name list
var units = "metric";

var cityLat = "";
var cityLon = "";

//OpenWeather Request variables
var APIKey = "f57655fbf21b91dc4e4940b14a581a26"; //default API key

//User enters city name and submits to update search results to current city
var formSubmitHandler = function(event) {
    event.preventDefault();

    //Update cityName based on user input
    var cityName = cityInputEl.value;

    console.log(cityName);//TODO: REMOVE
    // getCurrentWeather(cityName);
    getCurrentWeather(cityName);
};

// Fetch current weather based on user input
var getCurrentWeather = function (cityName) {
    var queryCurrentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey;  
    console.log(queryCurrentURL); //TODO: REMOVE

    //FETCH city query - userd for verification TODO: remove at the end
    //might be required for 5 day forecast.... look into
    fetch(queryCurrentURL) 
        .then(function (response) {
        response.json().then(function (data) {
        console.log(data);

        cityLat = data.coord.lat;
        cityLon = data.coord.lon;

        queryFullURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=" + units;  

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
                    })
                }
            });
        })
    })
    getForecastResults(cityName); //FIXME: update to event listener on submit at end
}

var getForecastResults = function(cityName) {
    var queryCurrentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey;

    fetch(queryCurrentURL)
        .then(function (response) {
            response.json().then(function (data) {
            console.log(data);

            cityLat = data.coord.lat;
            cityLon = data.coord.lon;

            baseFullURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=" + units;
            console.log(baseFullURL);

        fetch(baseFullURL)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                console.log(data);

                //create title for 5 day forecast section
                var weeklyTitleEl = document.createElement("h2");
                weeklyTitleEl.classList = "subtitle";
                weeklyTitleEl.textContent = "What do the next 5 days look like in " + cityName + "?";

                weeklyForecast.append(weeklyTitleEl);

                //create container for daily content
                var dailyCardContainer = document.createElement("div");
                dailyCardContainer.classList = "card-container flex-row justify-space-between";

                weeklyForecast.append(dailyCardContainer);

                for (var i = 0; i < baseFullURL.length; i++) {
                    let dateBlock = data.list[i].dt_txt.split(' ')[0];
                    let timeBlock = data.list[i].dt_txt.split(' ')[1];
                        if (timeBlock == "00:00:00") {
                            //for each day, create a card
                            var dailyCardEl = document.createElement("div");
                            dailyCardEl.classList = "daily-card";

                            //for each card, create a header with the date included
                            var dailyHeaderEl = document.createElement("h3");
                            dailyHeaderEl.classList = "daily-header";
                            dailyHeaderEl.textContent = dateBlock; 

                            //for each card, create a body for the content
                            var dailyBodyEl = document.createElement("div");
                            dailyBodyEl.classList = "daily-body";

                            var dayImg = document.createElement("img");
                            dayImg.src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                            var dayWeather = document.createElement("p");
                            dayWeather.textContent = "Weather: " + data.list[i].weather[0].description;

                            var dayTemp = document.createElement("p");
                            dayTemp.textContent = "Temp: " +  data.list[i].main.temp + " C";

                            var dayHumidity = document.createElement("p");
                            dayHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

                            var dayWind = document.createElement("p");
                            dayWind.textContent = "Wind Speed: " + data.list[i].wind.speed + " M/S";

                            dailyCardContainer.appendChild(dailyCardEl);
                            dailyCardEl.appendChild(dailyHeaderEl);
                            dailyCardEl.appendChild(dailyBodyEl);
                            dailyBodyEl.appendChild(dayImg);
                            dailyBodyEl.appendChild(dayWeather);
                            dailyBodyEl.appendChild(dayTemp);
                            dailyBodyEl.appendChild(dayHumidity);
                            dailyBodyEl.appendChild(dayWind);
                        } else {
                                console.log("no results found");
                            }
                        };
                    })//response for fetch baseFullURL
                }
            }) 
        })
        })
    };
    
userFormEl.addEventListener('submit', formSubmitHandler);
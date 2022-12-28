// Global Variables
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var recentSearchesEl = document.querySelector('.recent-searches');
var resultsContainerEl = document.querySelector('#results-container');
var searchResults = document.querySelector('#search-results');
var weeklyForecast = document.querySelector('.weekly-forecast');
var clearRecentButton = document.createElement("btn");
var dailyCards = document.querySelector('.daily-cards');
var today = dayjs().format("ddd DD MMM, YYYY");
// USER INPUT RESULTS
var cityName = "";
 //OpenWeather Request variables
var APIKey = "f57655fbf21b91dc4e4940b14a581a26"; //default API key
var limit = "1";
var cityLat = "";
var cityLon = "";

var storedSearches = JSON.parse(localStorage.getItem("storedSearches")) || [];

//set cityname and store user input in localstorage 
var formSubmitHandler = function(event) {
    event.preventDefault();
    let cityName = cityInputEl.value;

    //store user input in localStorage if it doesn't already exist
    if (!storedSearches.includes(cityInputEl.value)) {
        storedSearches.push(cityName);
        localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
    }

    //clear containers before next search
        searchResults.textContent = "";
        resultsContainerEl.textContent = "";
        weeklyForecast.textContent = "";
        cityInputEl.value = "";
    
    loadRecentSearches(cityName);
    getCurrentWeather(cityName);
};

// load the recent searches (if any)
var loadRecentSearches = function() {
    recentSearchesEl.innerHTML = "";
    if (storedSearches.length > 0) {

        var searchTitle = document.createElement("h3");
        searchTitle.classList = "search-title";
        searchTitle.textContent = "Recent Searches";
        recentSearchesEl.appendChild(searchTitle);


        for (var i = 0; i < storedSearches.length; i++) {
            var liEl = document.createElement("li");
            liEl.classList = "search-items"
            liEl.textContent = storedSearches[i];
            recentSearchesEl.appendChild(liEl);
        }
    }
};

// update search results based on previous searches
recentSearchesEl.addEventListener("click", function(event) {
    getCurrentWeather(event.target.textContent);
        searchResults.textContent = "";
        resultsContainerEl.textContent = "";
        weeklyForecast.textContent = "";
        cityInputEl.value = "";
});


// Fetch current weather based on user input
var getCurrentWeather = function (cityName) {
    var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=" + limit + "&appid=" + APIKey;  

    fetch(queryCurrentURL) 
        .then(function (response) {
            if (!response.ok) {
                alert("Failed to fetch weather");
                storedSearches.splice(storedSearches.length-1);
                console.log(storedSearches);
                loadRecentSearches();
            } else {
        response.json().then(function (data) {
        console.log(data);

            cityLat = data.coord.lat;
            cityLon = data.coord.lon;

            //fetch weather information based on user input
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=metric")
            .then(function (weatherResponse) {
                if (weatherResponse.ok) {
                    weatherResponse.json().then(function(weatherResults) {

                        //<----------- CURRENT DAY WEATHER STARTS HERE
                        //create title for current day forecast
                        var titleEl = document.createElement("h2");
                        titleEl.classList = "subtitle";
                        titleEl.textContent = cityName + " - " + today;
                        searchResults.append(titleEl);

                        //add new div to hold weather results
                        var currentWeatherEl = document.createElement("ul");
                        resultsContainerEl.append(currentWeatherEl);

                        var currentImg = document.createElement("img");
                        currentImg.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
                        currentWeatherEl.append(currentImg);

                        var currentWeatherDetails = [
                            weatherResults.weather[0].description,
                            "Temp: " +  weatherResults.main.temp + "C",
                            "Humidity: " + weatherResults.main.humidity + "%",
                            "Wind: " + weatherResults.wind.speed + "M/S",
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

            //<----------- 5 DAY FORECAST STARTS HERE
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=metric";

            fetch(forecastURL)
            .then(function(response) {
                if(response.ok) {
                response.json().then(function(data) {
                    
                    //create title for 5 day forecast section
                    var weeklyTitleEl = document.createElement("h2");
                    weeklyTitleEl.classList = "subtitle";
                    weeklyTitleEl.textContent = "What do the next 5 days look like in " + cityName + "?";
                    weeklyForecast.append(weeklyTitleEl);

                    //create container for daily content
                    var dailyCardContainer = document.createElement("div");
                    dailyCardContainer.classList = "card-container flex-row";
                    weeklyForecast.append(dailyCardContainer);

                    //start daily forecast section for loop
                    for (var i = 0; i < forecastURL.length; i++) {
                        let timeBlock = data.list[i].dt_txt.split(' ')[1];
                    
                            if (timeBlock == "03:00:00") {
                                //for each day, create a card
                                var dailyCardEl = document.createElement("div");
                                dailyCardEl.classList = "daily-card";
                                dailyCardContainer.appendChild(dailyCardEl);

                                //for each card, create a header with the date included
                                var dailyHeaderEl = document.createElement("h3");
                                dailyHeaderEl.classList = "daily-header";
                                var dateCode = data.list[i].dt
                                dailyHeaderEl.innerHTML = dayjs.unix(dateCode).format('DD/MM/YYYY');
                                dailyCardEl.appendChild(dailyHeaderEl);

                                //for each card, create a body for the content
                                var dailyBodyEl = document.createElement("ul");
                                dailyBodyEl.classList = "daily-body";
                                dailyCardEl.appendChild(dailyBodyEl);

                                //for each day, get the results and append to each card
                                var dayImg = document.createElement("img");
                                dayImg.src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";

                                var dayWeather = document.createElement("li");
                                dayWeather.textContent = data.list[i].weather[0].description;
    
                                var dayTemp = document.createElement("li");
                                dayTemp.textContent = "Temp: " +  data.list[i].main.temp + " C";
    
                                var dayHumidity = document.createElement("li");
                                dayHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";
    
                                var dayWind = document.createElement("li");
                                dayWind.textContent = "Wind: " + data.list[i].wind.speed + " M/S";
                                
                                dailyBodyEl.appendChild(dayImg);
                                dailyBodyEl.appendChild(dayWeather);
                                dailyBodyEl.appendChild(dayTemp);
                                dailyBodyEl.appendChild(dayHumidity);
                                dailyBodyEl.appendChild(dayWind);

                                } else {
                                    console.log("no results found");
                                }
                            }
                        })
                    }
                })
            })
        }
    })
}


userFormEl.addEventListener('submit', formSubmitHandler);

loadRecentSearches();
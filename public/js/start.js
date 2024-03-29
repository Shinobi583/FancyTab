const greetText = document.querySelector("#greetText");
const userName = document.querySelector("#name");
const timeDisplay = document.querySelector("#time");
let date = new Date();
let hour = date.getHours();
setInterval(function () {
    date = new Date();
    hour = date.getHours();
    greetText.textContent = getGreeting(hour);
    timeDisplay.textContent = getTime(date);
}, 5000);

chrome.storage.local.get(["bgData", "name", "text", "weatherOption", "zip", "recentOpt"], function (items) {
    document.body.style.backgroundImage = `url(${items.bgData})`;
    greetText.textContent = getGreeting(hour);
    userName.textContent = ` ${items.name}`;
    if (items.text === "white") {
        document.querySelector("#greeting").classList.add("dark-bg");
        timeDisplay.classList.add("dark-bg");
    }
    document.querySelector("#hero").style.color = items.text;
    timeDisplay.textContent = getTime(date);

    if (items.weatherOption === "yes") {
        getWeather(items.zip);
    }

    if (items.recentOpt === "yes") {
        showRecents();
    }
});

function showRecents() {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    let oneWeekAgo = new Date().getTime() - millisecondsPerWeek;
    chrome.history.search({
        text: '',
        startTime: oneWeekAgo,
        maxResults: 5
    }, function (results) {
        const sect = document.createElement("section");
        results.forEach(function (page) {
            sect.id = "recents";
            const anchor = document.createElement("a");
            anchor.className = "recent";
            anchor.href = page.url;
            anchor.textContent = page.title;
            sect.appendChild(anchor);
        });
        document.body.appendChild(sect);
    });
}

function getGreeting(hour) {
    if (hour < 12) {
        return "Good Morning,";
    }
    else if (hour < 17) {
        return "Good Afternoon,";
    }
    else {
        return "Good Evening,";
    }
}

function getTime(date) {
    const timeString = date.toLocaleString("en-US", { hour12: true, hour: "numeric", minute: "numeric" });
    return timeString;
}

async function getWeather(zip) {
    let display = document.querySelector("#weather");
    display.classList.remove("hidden");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=6fde47677d50efb4d4ec42bde7cffcdf`);
        const weather = await response.json();

        let output = `<p class="m-0 title"><em>Weather</em></p>
        <ul>
        <li id="city">${weather.name}</li>
        <li>${Math.floor(weather.main.temp)}&#8457</li>
        <li>${weather.weather[0].main}</li>
        </ul>`;
        display.innerHTML = output;
    }
    catch (e) {
        console.log(e);
        document.querySelector("#weather").innerHTML = "<p id='error'>There was an error getting the weather. Please try again later.</p>";
    }
}
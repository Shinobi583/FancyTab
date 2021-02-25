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

let greeting = getGreeting(hour);

chrome.storage.local.get(["bgData", "name", "text"], function (items) {
    document.body.style.backgroundImage = `url(${items.bgData})`;
    greetText.textContent = getGreeting(hour);
    userName.textContent = ` ${items.name}`;
    if (items.text === "white") {
        document.querySelector("div").classList.add("dark-bg");
        timeDisplay.classList.add("dark-bg");
    }
    document.querySelector("#hero").style.color = items.text;
    timeDisplay.textContent = getTime(date);
});

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
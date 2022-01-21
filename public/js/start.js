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

chrome.storage.local.get(["bgData", "name", "text", "recentOpt"], function (items) {
    document.body.style.backgroundImage = `url(${items.bgData})`;
    greetText.textContent = getGreeting(hour);
    userName.textContent = ` ${items.name}`;
    if (items.text === "white") {
        document.querySelector("#greeting").classList.add("dark-bg");
        timeDisplay.classList.add("dark-bg");
    }
    document.querySelector("#hero").style.color = items.text;
    timeDisplay.textContent = getTime(date);

    if (items.recentOpt === "yes") {
        showRecents();
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
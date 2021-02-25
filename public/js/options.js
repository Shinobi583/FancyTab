function saveOptions() {
    let name = document.querySelector("#name").value;
    let text = document.querySelector("#text").value;
    let weatherOpt = document.querySelector("form").weather.value;
    let zipCode = document.querySelector("#zip").value;
    
    let file = document.querySelector("#file").files[0];
    let reader = new FileReader();

    // Attempt to read file/Allowed file size.
    if (file === undefined || file.size <= 2500000) {
        try {
            reader.readAsDataURL(file);
        }
        catch (error) {
            console.log(error);
        }
        reader.onload = function () {
            let fileContent = reader.result;
            chrome.storage.local.set({
                bgName: file.name,
                bgData: fileContent
            }, () => { console.log("Bg Set"); });
        }
    }
    else {
        // Display warning message
        notifySave(false);
    }

    // Set the rest and notify of save.
    chrome.storage.local.set({
        name: name,
        text: text,
        weatherOption: weatherOpt,
        zip: zipCode
    }, notifySave);
}

function notifySave(isSuccess = true) {
    if (isSuccess) {
        let status = document.querySelector("#status");
        status.textContent = "Options saved.";
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    }
    else {
        let extra = document.querySelector("#extra");
        extra.textContent = "Background image is too large. For a faster experience, please choose a file size of 2.5Mb or less.";
        setTimeout(function () {
            extra.textContent = '';
        }, 10000);
    }
    
    chrome.tabs.query({
        url: "chrome://newtab/"

    }, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.reload(tab.id, () => { return; });
        });
    });
}

function restoreOptions() {
    chrome.storage.local.get(["bgName", "name", "text", "weatherOption", "zip"], function (items) {
        document.querySelector("#currentBg").textContent = items.bgName;
        document.querySelector("#name").value = items.name;
        document.querySelector("#text").value = items.text;
        document.querySelector("form").weather.value = items.weatherOption;
        document.querySelector("#zip").value = items.zip;
    });
}

restoreOptions();
document.querySelector("#save").addEventListener("click", saveOptions);
const shortenForm = document.getElementById("shortenForm");
const output = document.getElementById("output");
const outputField = document.getElementById("outputField");
const copyBtn = document.getElementById("copyBtn");
const errors = document.getElementById("errors");
const errorText = document.getElementById("errorText");
const closeImg = document.getElementById("closeImg");
const trackShortened = document.getElementById("trackShortened");
const trackerForm = document.getElementById("trackerForm");
const trackField = document.getElementById("trackField");
const shortenNew = document.getElementById("shortenNew");
const trackLink = document.getElementById("trackLink");
const clicksContainer = document.getElementById("clicksContainer");
const clicksHolder = document.getElementById("clicksHolder");
const refreshTracker = document.getElementById("refreshTracker");

shortenForm.addEventListener("submit", function (e) {
  e.preventDefault();
  createLink(shortenForm.longLink.value);
});

//make api post request to create a short link
function createLink(link) {
  fetch("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      longLink: link,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.shortLink) deployLink(data.shortLink);
      else if (data.error) {
        setError(data.error);
      }
    })
    .catch((error) => console.log(error));
}

//display the shortned link
function deployLink(link) {
  output.style.opacity = "1";
  outputField.value = link;
  copyBtn.addEventListener("click", function () {
    copyLink(link);
  });
  trackShortened.addEventListener("click", function () {
    shortenForm.style.display = "none";
    output.style.display = "none";
    trackerForm.style.display = "block";
    trackField.value = link;
    getClicks(link);
  });
}

//copy the shortened link to clipboard on click
function copyLink(link) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = link;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

//display errors returning from the server
function setError(err) {
  errorText.textContent = err;
  errors.style.opacity = "1";
}

//closing error message
closeImg.addEventListener("click", function () {
  errors.style.opacity = "0";
});

shortenNew.addEventListener("click", function () {
  shortenForm.style.display = "block";
  trackerForm.style.display = "none";
  clicksContainer.style.display = "none";
});

trackLink.addEventListener("click", function () {
  shortenForm.style.display = "none";
  output.style.display = "none";
  trackerForm.style.display = "block";
});

//make api post request to get the number of clicks on a link
function getClicks(link) {
  fetch("/getClicks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shortLink: link,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.clicks !== null) displayClicks(data.clicks);
      else if (data.error) {
        setError(data.error);
      }
    })
    .catch((error) => console.log(error));
}

trackerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getClicks(trackerForm.trackField.value);
});

function displayClicks(number) {
  clicksContainer.style.display = "flex";
  clicksHolder.innerHTML = number;
}

refreshTracker.addEventListener("click", function () {
  getClicks(trackerForm.trackField.value);
});

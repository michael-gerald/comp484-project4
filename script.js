const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

let timer = [0,0,0];
let interval;
let timerRunning = false;

let errors = 0;
let lastLength = "";


// sentences/text options
// Po from Kung Fu Panda quotes
// and random song lyrics I included 
// while listening to this project
const textOptions = [
    "I like pandas because they are super chill and cute looking!",
    "Tension between us like picket fences, you got issues that I won't mention for now.", 
    "If the world was ending, I'd wanna be next to you.", 
    "Look at the stars, look how they shine for you.",
    "I'm not a big fat panda, I'm the big fat panda."
];

//picks a random sentence/text option
function setRandomText() {
    return textOptions[Math.floor(Math.random() * textOptions.length)];
}

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    return (time <= 9 ? "0" : "") + time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime =
        leadingZero(timer[0]) + ":" +
        leadingZero(timer[1]) + ":" +
        leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;

    timer[2]++; //hundredths
    if (timer[2] === 100) {
        timer[2] = 0;
        timer[1]++; //seconds
    }
    if (timer[1] === 60) {
        timer[1] = 0;
        timer[0]++; //minutes
    }
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originText = document.querySelector("#origin-text p").innerHTML;
    let originTextMatch = originText.substring(0, textEntered.length);
    //checks for errors
    if (textEntered !== originTextMatch && textEntered.length > lastLength.length) {
        errors++;
        document.querySelector("#errors").textContent = errors;
    }

    lastLength = textEntered;
    //borders to display whats going on
    //blue: while typing AND text matches correctly
    //red: error detected
    //green: test finish
    if (textEntered === originText) {
        testWrapper.style.borderColor = "green"; //test finished
        clearInterval(interval); //stops timer
        //score
        calcWPM(); //calculates and displays wpm
        saveScores();
    } else if (textEntered === originTextMatch) {
        testWrapper.style.borderColor = "blue"; //typing correct
    } else {
        testWrapper.style.borderColor = "red"; //errors
    }
    calcWPM(); 
}

// Start the timer:
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0];
    timerRunning = false;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";

    testWrapper.style.borderColor = "grey";

    errors = 0;
    lastLength = "";

    document.querySelector("#origin-text p").innerHTML = setRandomText();
    document.querySelector("#errors").textContent = 0;
    document.querySelector("#wpm").textContent = 0;
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", startTimer);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);

// extra functions
function getTotalTime() { //total time in seconds
    return timer[0] * 60 + timer[1] + timer[2] / 100;
}
function calcWPM() {
    let totalChars = testArea.value.length;
    let totalTime = getTotalTime();

    if (totalTime === 0) return; //prevents division by 0, so time > 0

    let wpm = (totalChars / 5) / (totalTime / 60); // WPM calculation
    document.querySelector("#wpm").innerHTML = "WPM: " + Math.max(1,Math.round(wpm)); //rounds to nearest whole #
}
// converts timer array into string
function formatTime(t) {
    return leadingZero(t[0]) + ":" + leadingZero(t[1]) + ":" + leadingZero(t[2]);
}
//save scores
function saveScores() {
    let score = getTotalTime();
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.push(score);

    scores.sort((a, b) => a - b); //sorts by ascending order
    scores = scores.slice(0, 3); //only shows top 3 scores

    localStorage.setItem("scores", JSON.stringify(scores));
    showScores();
}
//show scores
function showScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let list = document.querySelector("#top-scores");

    list.innerHTML = "";

    scores.forEach(score => {
        let li = document.createElement("li");
        li.textContent = score.toFixed(2) + " seconds";
        list.appendChild(li);
    })
}

//sets random text as well as
//showing past scores (if any)
document.querySelector("#origin-text p").innerHTML = setRandomText();
showScores();
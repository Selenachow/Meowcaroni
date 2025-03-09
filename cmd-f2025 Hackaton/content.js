let cat = null;
let textBox = null;
let moveInterval = null;
let inactivityTimer = null;
let meowVolume = 0.3; // Start at 20% volume
const maxVolume = 1.0;
const inactivityDuration = 10000; // 10 seconds
const socialMediaSites = ["reddit.com", "facebook.com", "instagram.com"];
const meowSound = new Audio(chrome.runtime.getURL("meow.mp3"));
meowSound.loop = true; // Loop the meow sound
let closingTab = false; // Prevents cat movement glitches during tab closing
let isBannedSite = false; // Tracks if the site is banned

// Ensure audio is loaded before playing
meowSound.oncanplaythrough = () => console.log("🐱 Meow sound loaded!");

function addCat() {
    if (cat) return; // Ensure only one cat exists

    // Create cat image
    cat = document.createElement("img");
    cat.src = chrome.runtime.getURL("cat.gif");
    cat.style.position = "fixed";
    cat.style.top = "75px";
    cat.style.left = "0px";
    cat.style.width = "120px"; // Slightly bigger
    cat.style.zIndex = "99999";
    cat.style.transform = "scaleX(1)"; // Default facing right
    document.body.appendChild(cat);

    // Create floating text box
    textBox = document.createElement("div");
    textBox.style.position = "fixed";
    textBox.style.top = "50px";
    textBox.style.left = "0px";
    textBox.style.fontSize = "16px";
    textBox.style.background = "lightyellow";
    textBox.style.padding = "5px 10px";
    textBox.style.borderRadius = "8px";
    textBox.style.border = "1px solid black";
    textBox.style.zIndex = "99999";
    document.body.appendChild(textBox);

    walkCat(); // Start walking
}

// 🐱 Change text box content based on website type
function changeTextBox() {
    let phrases;

    if (isBannedSite) {
        // If on a banned site, use these phrases (NO "Hi there!")
        phrases = [
            "🚨 Hey! Should you be here?",
            "🐾 Let's get back to work!",
            "😼 Distractions ahead!",
            "⏳ Time to close this!"
        ];
    } else {
        // For regular sites, start with friendly messages
        phrases = [
            "😺 Hello there!",
            "🐾 What are you doing?",
            "🤔 Need some help?",
            "🚀 Let's stay productive!"
        ];
    }

    let index = 0;
    textBox.innerText = phrases[0]; // Set first phrase immediately

    let changeTextInterval = setInterval(() => {
        index++;

        if (index < phrases.length) {
            textBox.innerText = phrases[index]; // Change phrases every second
        } else {
            clearInterval(changeTextInterval);
            textBox.innerText = isBannedSite ? "❌ Closing in 5...4...3...2...1!" : "😼 Stay Focused!";
        }
    }, 1500); // Change every second (total of 4 seconds)
}

// 🐱 Make the cat walk, stop, meow, and flip direction
function walkCat() {
    let speed = 2; // Pixels per movement
    let direction = -1; // 1 = right, -1 = left

    moveInterval = setInterval(() => {
        if (closingTab) return; // Prevent movement if closing tab

        let currentLeft = parseInt(cat.style.left);
        
        if (currentLeft > window.innerWidth - 120 || currentLeft < 0) {
            // Flip direction when hitting screen edges
            direction *= -1;
            cat.style.transform = `scaleX(${direction})`; // Flip image
        }

        cat.style.left = (currentLeft + speed * direction) + "px";
        textBox.style.left = (parseInt(cat.style.left) + 40) + "px"; // Move text box
    }, 30);
}

// 🐱 Check if the site is social media, start meowing after 5 sec, close after 12 sec
function checkForSocialMedia() {
    isBannedSite = socialMediaSites.some(site => window.location.href.includes(site));
    addCat(); // Show cat

    // Start displaying correct phrases after detecting site type
    changeTextBox();

    if (isBannedSite) {
        setTimeout(() => {
            console.log("🚨 Social media detected! Starting meow...");
            meowSound.play()
                .then(() => console.log("🐱 Meowing due to social media!"))
                .catch(err => console.warn("⚠️ Meow failed to play:", err));
            
            increaseMeowVolume();
        }, 5000);

        // Start countdown at 9 seconds (3 seconds before closing)
        setTimeout(() => {
            let countdown = 5;
            let countdownInterval = setInterval(() => {
                textBox.innerText = `❌ Closing in ${countdown}...`;
                countdown--;
                if (countdown === 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }, 9000); // Start countdown after 9 seconds

        setTimeout(() => {
            closeTab();
        }, 12000); // Close tab after 12 seconds
    }
}

// 🐱 Walk smoothly to the close button and shut the tab
function closeTab() {
    if (closingTab) return;
    closingTab = true; // Prevents movement glitches

    let closeAnimation = setInterval(() => {
        let currentLeft = parseInt(cat.style.left);
        let targetLeft = window.innerWidth - 50;

        if (currentLeft < targetLeft) {
            cat.style.left = (currentLeft + 3) + "px"; // Move towards "X" smoothly
            textBox.style.left = (parseInt(cat.style.left) + 40) + "px"; // Keep text box following
        } else {
            clearInterval(closeAnimation);
            console.log("❌ Closing social media tab...");
            chrome.runtime.sendMessage({ action: "closeTab" });
        }
    }, 30);
}

// 🐱 Remove cat and stop meowing
function removeCat() {
    if (cat) {
        cat.remove();
        cat = null;
        textBox.remove();
        textBox = null;
        clearInterval(moveInterval);
        meowSound.pause();
        meowSound.currentTime = 0;
        console.log("🚫 Cat removed & meowing stopped.");
        closingTab = false;
    }
}

// 🐱 Initialize cat if enabled
chrome.storage.local.get(["catEnabled"], (result) => {
    if (result.catEnabled) {
        checkForSocialMedia();
    }
});

// 🐱 Stop meowing when user clicks cat
document.addEventListener("click", (event) => {
    if (event.target === cat) {
        meowSound.pause();
        meowSound.currentTime = 0;
        meowVolume = 0.3; // Reset volume
        console.log("🐾 Cat clicked! Meowing stopped.");
    }
});

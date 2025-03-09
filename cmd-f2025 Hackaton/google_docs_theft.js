console.log("🐱 Desktop Cat is now stealing words from Google Docs!");

// Find the document text container
function findGoogleDocsText() {
    let doc = document.querySelector(".kix-appview-editor");
    if (!doc) {
        console.warn("Google Docs text area not found.");
        return null;
    }
    return doc;
}

// Function to steal words from Google Docs
function stealWordFromGoogleDocs() {
    let doc = findGoogleDocsText();
    if (!doc) return;

    let textElements = doc.querySelectorAll("div.kix-lineview-content");
    if (textElements.length === 0) return;

    let randomElement = textElements[Math.floor(Math.random() * textElements.length)];
    let text = randomElement.innerText.trim();

    if (text.length < 5 || !text.includes(" ")) return;

    let words = text.split(/\s+/);
    let stolenWordIndex = Math.floor(Math.random() * words.length);
    let stolenWord = words.splice(stolenWordIndex, 1)[0];

    // Update the text in Google Docs
    let newText = words.join(" ");
    randomElement.innerText = newText;

    // Display stolen word on screen
    let stolenText = document.createElement("div");
    stolenText.innerText = `🐱 Stole: "${stolenWord}"`;
    stolenText.style.position = "fixed";
    stolenText.style.left = Math.random() * window.innerWidth + "px";
    stolenText.style.top = Math.random() * window.innerHeight + "px";
    stolenText.style.background = "yellow";
    stolenText.style.padding = "5px";
    stolenText.style.border = "1px solid black";
    stolenText.style.fontSize = "14px";
    stolenText.style.zIndex = "99999";
    document.body.appendChild(stolenText);

    setTimeout(() => stolenText.remove(), 4000);
}

// Run the stealing function every 10-15 seconds
setInterval(() => {
    if (Math.random() < 0.2) {
        stealWordFromGoogleDocs();
    }
}, 15000);
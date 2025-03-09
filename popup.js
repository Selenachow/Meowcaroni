document.addEventListener("DOMContentLoaded", () => {
    const toggleCheckbox = document.getElementById("toggleCat");

    chrome.storage.local.get(["catEnabled"], (result) => {
        toggleCheckbox.checked = result.catEnabled ?? false;
    });

    toggleCheckbox.addEventListener("change", () => {
        chrome.storage.local.set({ catEnabled: toggleCheckbox.checked });
    });
});
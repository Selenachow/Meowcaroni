// // Function to create and animate the cat
// function createRunningCat() {
//     let cat = document.createElement("img");
//     cat.src = "cat.png"; // Replace with your local cat image if needed
//     cat.id = "runningCat";
    
//     // Style the cat
//     cat.style.position = "fixed";
//     cat.style.bottom = "50px"; // Position at the bottom
//     cat.style.left = "-150px"; // Start off-screen
//     cat.style.width = "100px";
//     cat.style.cursor = "pointer";
//     cat.style.zIndex = "9999";
    
//     document.body.appendChild(cat);

//     // Function to move the cat across the screen
//     function moveCat() {
//         cat.style.transition = "left 5s linear"; // Smooth transition
//         cat.style.left = ${window.innerWidth}px; // Move to the right end

//         // Reset cat position after it disappears
//         setTimeout(() => {
//             cat.style.transition = "none"; // Remove transition to reset instantly
//             cat.style.left = "-150px"; // Reset position to the left
//             setTimeout(moveCat, 100); // Restart animation after short delay
//         }, 5000);
//     }

//     // Start the movement
//     setTimeout(moveCat, 100);

//     // Remove cat when clicked
//     cat.addEventListener("click", () => {
//         cat.remove();
//     });
// }
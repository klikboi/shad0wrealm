const bootText = "> INITIALIZING SHAD0WREALM... \n> LOADING ASSETS... \n> ACCESS GRANTED.";
const target = document.getElementById("boot-text");
let i = 0;

function typeWriter() {
    if (i < bootText.length) {
        target.innerHTML += bootText.charAt(i) === '\n' ? '<br>' : bootText.charAt(i);
        i++;
        setTimeout(typeWriter, 30); // Speed of typing
    }
}

// The Transition Logic
window.onload = () => {
    typeWriter();
    setTimeout(() => {
        document.getElementById("boot-screen").classList.add("hidden");
        document.getElementById("main-terminal").classList.remove("hidden");
        // Optional: Add a flash effect here
        document.body.style.backgroundColor = "white";
        setTimeout(() => document.body.style.backgroundColor = "var(--bg-color)", 50);
    }, 2500); // 2.5 Seconds
};
const soundToggleButton = document.getElementById("sound-toggle");
const soundToggleLabel = soundToggleButton.querySelector("span");
const soundToggleIcon = soundToggleButton.querySelector("i");
const audioElements = document.querySelectorAll("audio");
const soundPreferenceKey = "myGamingPassionMuted";

let soundsMuted = false;

try {
    soundsMuted = localStorage.getItem(soundPreferenceKey) === "true";
} catch (error) {
    console.warn("Unable to read the saved sound preference:", error);
}

function updateSoundToggle() {
    audioElements.forEach((audio) => {
        audio.muted = soundsMuted;
    });

    soundToggleButton.setAttribute("aria-pressed", String(soundsMuted));
    soundToggleLabel.textContent = soundsMuted ? "Unmute sounds" : "Mute sounds";
    soundToggleIcon.classList.toggle("fa-volume-xmark", soundsMuted);
    soundToggleIcon.classList.toggle("fa-volume-high", !soundsMuted);
}

soundToggleButton.addEventListener("click", () => {
    soundsMuted = !soundsMuted;
    updateSoundToggle();

    try {
        localStorage.setItem(soundPreferenceKey, String(soundsMuted));
    } catch (error) {
        console.warn("Unable to save the sound preference:", error);
    }
});

updateSoundToggle();

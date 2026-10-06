const leaderboardPanel = document.getElementById("leaderboard-panel");
const leaderboardGame = leaderboardPanel.dataset.game;
const playerNameForm = document.getElementById("player-name-form");
const playerNameInput = document.getElementById("player-name");
const leaderboardStatus = document.getElementById("leaderboard-status");
const leaderboardRows = document.getElementById("leaderboard-rows");
const playerNameKey = "myGamingPassionPlayerName";
const scoresKey = `myGamingPassionScores-${leaderboardGame}`;
let pendingScore = null;

function setLeaderboardStatus(message, isError = false) {
    leaderboardStatus.textContent = message;
    leaderboardStatus.classList.toggle("error", isError);
}

function getScores() {
    const storedScores = localStorage.getItem(scoresKey);
    if (!storedScores) return [];

    const scores = JSON.parse(storedScores);
    if (!Array.isArray(scores)) {
        throw new Error("Saved high scores are not in the expected format.");
    }

    return scores.filter((entry) =>
        entry &&
        typeof entry.name === "string" &&
        Number.isFinite(entry.score) &&
        entry.score >= 0
    );
}

function renderScores() {
    leaderboardRows.replaceChildren();

    try {
        const scores = getScores();
        if (scores.length === 0) {
            const row = leaderboardRows.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.textContent = "No scores yet.";
            cell.className = "empty-scores";
            return;
        }

        scores.slice(0, 10).forEach((entry, index) => {
            const row = leaderboardRows.insertRow();
            row.insertCell().textContent = String(index + 1);
            row.insertCell().textContent = entry.name;
            row.insertCell().textContent = String(entry.score);
        });
    } catch (error) {
        setLeaderboardStatus(`Unable to load high scores: ${error.message}`, true);
    }
}

try {
    playerNameInput.value = localStorage.getItem(playerNameKey) || "";
} catch (error) {
    setLeaderboardStatus(`Unable to load your saved name: ${error.message}`, true);
}

playerNameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = playerNameInput.value.trim();
    if (!name) {
        setLeaderboardStatus("Enter a name before saving.", true);
        playerNameInput.focus();
        return;
    }

    try {
        localStorage.setItem(playerNameKey, name);
        playerNameInput.value = name;
        setLeaderboardStatus(`Name saved as ${name}. Scores are stored in this browser.`);
        if (pendingScore !== null) {
            window.gameLeaderboard.record(pendingScore);
        }
    } catch (error) {
        setLeaderboardStatus(`Unable to save your name: ${error.message}`, true);
    }
});

window.gameLeaderboard = {
    record(score) {
        if (!Number.isFinite(score) || score <= 0) return false;

        const name = playerNameInput.value.trim();
        if (!name) {
            pendingScore = Math.floor(score);
            setLeaderboardStatus("Enter and save your name to add this score.", true);
            return false;
        }

        try {
            localStorage.setItem(playerNameKey, name);
            const scores = getScores();
            scores.push({ name, score: Math.floor(score) });
            scores.sort((first, second) => second.score - first.score);
            localStorage.setItem(scoresKey, JSON.stringify(scores.slice(0, 10)));
            renderScores();
            pendingScore = null;
            setLeaderboardStatus(`Score saved for ${name}.`);
            return true;
        } catch (error) {
            pendingScore = Math.floor(score);
            setLeaderboardStatus(`Unable to save the high score: ${error.message}`, true);
            return false;
        }
    }
};

renderScores();

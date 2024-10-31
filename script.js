// User profiles (username and password)
const userProfiles = {
    "AngelaKant": "KantAngela",
    "LukeRomano": "RomanoLuke",
    "RyanSanders": "SanderesRyan",
    "CharlesKeegan": "KeeganCharles"
};

// To store user picks and leaderboard
let userPicks = {};
let assignedPoints = new Set();
let leaderboard = [];
let games = []; // Global variable to hold game details after fetching

// Function to fetch NFL game data from the API
async function fetchGameData() {
    try {
        const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events', {
            headers: {
                'x-api-key': 'cf87518a-2988-4c7b-8ac9-4443bb'
            }
        });

        if (!response.ok) throw new Error("Failed to fetch game events");

        const data = await response.json();
        
        games = [];

        for (let item of data.items) {
            const gameResponse = await fetch(item.$ref);
            const gameData = await gameResponse.json();

            const game = {
                homeTeam: gameData.competitions[0].competitors[0].team.displayName,
                awayTeam: gameData.competitions[0].competitors[1].team.displayName,
                date: gameData.date,
                status: gameData.status.type.shortDetail
            };

            games.push(game);
        }

        displayGames(games);
    } catch (error) {
        console.error("Error fetching NFL data:", error);
    }
}

// Function to display games on the page
function displayGames(games) {
    const tableBody = document.getElementById('gamesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    games.forEach((game, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${game.homeTeam} vs ${game.awayTeam}</td>
            <td>${new Date(game.date).toLocaleString()}</td>
            <td>${game.status}</td>
            <td>
                <button onclick="pickGame(${index})">Pick</button>
            </td>
            <td>
                <input type="number" id="confidence${index}" min="1" max="15" required>
            </td>
        `;
    });
}

// Function to handle user login
function login(username, password) {
    if (userProfiles[username] === password) {
        sessionStorage.setItem("loggedInUser", username);
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('userHomeSection').style.display = 'block';
        document.getElementById('gamesSection').style.display = 'block';
        document.getElementById('leaderboardSection').style.display = 'block';
        document.getElementById('usernameDisplay').textContent = username;
        fetchGameData();
    } else {
        alert("Invalid username or password.");
    }
}

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
}

// Setup form to trigger handleLogin on submission
document.querySelector("form").onsubmit = handleLogin;

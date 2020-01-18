const inquirer = require("inquirer");
const mainSearchFunction = require("./liriApp.js");

if (process.argv.length > 2) {
    const [_, __, command, answer] = process.argv;
    handleCommand(command, answer || "");
} else {
    runInquirer();
}

function handleCommand(command, answer) {
    switch (command) {
        case "concert-this":
            if (answer === "") {
                console.log("Please enter a band!");
                return;
            }
            mainSearchFunction.searchForBand(answer);
            break;
        case "spotify-this-song":
            mainSearchFunction.searchSpotify(answer);
            break;
        case "movie-this":
            mainSearchFunction.searchForMovie(answer);
            break;
        case "do-what-it-says":
            mainSearchFunction.doThis();
            break;
    }
}

function runInquirer() {
    inquirer
        .prompt([
            {
                name: "command",
                type: "list",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
                message: "what are you up for today?"
            }
        ])
        .then(choice => {
            switch (choice.command) {
                case "concert-this":
                    initiateSearchForBand();
                    break;
                case "spotify-this-song":
                    initiateSearchSpotify();
                    break;
                case "movie-this":
                    initiateSearchForMovie();
                    break;
                case "do-what-it-says":
                    mainSearchFunction.doThis();
                    break;
            }
        });
}

function initiateSearchForBand() {
    inquirer
        .prompt([
            {
                name: "band",
                type: "input",
                message: "What band you are looking for?"
            }
        ])
        .then(answer => {
            if (answer.band === "") {
                console.log("Please enter a band!");
                return initiateSearchForBand();
            }
            mainSearchFunction.searchForBand(answer.band);
        })
}

function initiateSearchForMovie() {
    inquirer
        .prompt([
            {
                name: "movie",
                type: "input",
                message: "What movie your searching for?"
            }
        ])
        .then(answer => {
            mainSearchFunction.searchForMovie(answer.movie);
        })
}

function initiateSearchSpotify() {
    inquirer
        .prompt([
            {
                name: "track",
                type: "input",
                message: "What song you are loking for?"
            }
        ])
        .then(answer => {
            mainSearchFunction.searchSpotify(answer.track);
        })
}
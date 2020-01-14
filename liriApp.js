require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api')
const spotify = new Spotify(keys.spotify);;
const axios = require('axios').default;
const inquirer = require("inquirer");

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
                doThis();
                break;
        }
    })


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
            searchForBand(answer.band);
        })
}

function searchForBand(answer) {
    if (answer === "") {
        console.log("Please enter a band!");
        return initiateSearchForBand();
    }
    let band = answer.replace(" ", "+");
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
        .then(response => {
            for (let i = 0; i < response.data.length; i++) {

                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date of the Event: " + response.data[i].datetime.replace("T", "\nStart at: "));
                console.log("\x1b[32m%s\x1b[0m", ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<");
            }
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
            searchForMovie(answer.movie);
        })
}

function searchForMovie(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should! \nIt's on Netflix! \n>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<");
    }
    axios.get(`http://www.omdbapi.com/?t=${movie}/&y=&plot=short&apikey=trilogy`)
        .then(response => {
            console.log("Title of the movie: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Released);
            console.log("IMDB Rating of the movie: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + response.data.Rated);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Plot of the movie: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
            console.log("\x1b[34m%s\x1b[0m", ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<");
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
            searchSpotify(answer.track);
        })
}

function searchSpotify(answer) {
    if (answer === "") {
        answer = "The Sign";
    }
    spotify
        .search({ type: 'track', query: answer })
        .then(response => {
            for (let track of response.tracks.items) {
                console.log("Artist: " + track.artists[0].name);
                console.log("Song Name: " + track.name);
                console.log("Preview Link: " + track.href);
                console.log("Album: " + track.album.name);
                console.log("\x1b[35m%s\x1b[0m", ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<");
            }
        })
        .catch(err => {
            throw err;
        })
}

function doThis() {
    fs.readFile("random.txt", (err, data) => {
        if (err) { throw err; }
        let [command, param] = data.toString().split(",");
        switch (command) {
            case "concert-this":
                searchForBand(param);
                break;
            case "spotify-this-song":
                searchSpotify(param);
                break;
            case "movie-this":
                searchForMovie(param);
                break;
            case "do-what-it-says":
                console.log("Ahaha! Recursion^^");
                break;
        }
        console.log(data.toString());
    })
}
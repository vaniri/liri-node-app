require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);;
const axios = require('axios').default;


let colors = ["30", "31", "32", "33", "34", "35",];

function getColor(arr) {
    let color = `\x1b[${arr[Math.floor(Math.random() * arr.length)]}m%s\x1b[0m`;
    return (color);
}

const divider = ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<";

function searchForBand(answer) {
    let band = answer.replace(" ", "+");
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
        .then(response => {
            for (let i = 0; i < response.data.length; i++) {

                printLogged("Venue Name: " + response.data[i].venue.name);
                printLogged("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                printLogged("Date of the Event: " + response.data[i].datetime.replace("T", "\nStart at: "));
                console.log(getColor(colors), divider);
            }
        })
}

function searchForMovie(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should! \nIt's on Netflix!");
        console.log(getColor(colors), divider);
    }
    axios.get(`http://www.omdbapi.com/?t=${movie}/&y=&plot=short&apikey=trilogy`)
        .then(response => {
            printLogged("Title of the movie: " + response.data.Title);
            printLogged("Year the movie came out: " + response.data.Released);
            printLogged("IMDB Rating of the movie: " + response.data.imdbRating);
            printLogged("Rotten Tomatoes Rating of the movie: " + response.data.Rated);
            printLogged("Country where the movie was produced: " + response.data.Country);
            printLogged("Language of the movie: " + response.data.Language);
            printLogged("Plot of the movie: " + response.data.Plot);
            printLogged("Actors in the movie: " + response.data.Actors);
            console.log(getColor(colors), divider);
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
                printLogged("Artist: " + track.artists[0].name);
                printLogged("Song Name: " + track.name);
                printLogged("Preview Link: " + track.href);
                printLogged("Album: " + track.album.name);
                console.log(getColor(colors), divider);
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
    })
}
function log(data) {
    fs.appendFile("log.txt", data + "\n", (err) => {
        if (err) { throw err; }
    });
}

function printLogged(data) {
    console.log(data);
    log(data);
}


module.exports = {
    searchForBand,
    searchForMovie,
    searchSpotify,
    doThis
};
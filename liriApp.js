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
            if (answer.band === "") {
                console.log("Please enter a band!");
                return initiateSearchForBand();
            }
            let band = answer.band.replace(" ", "+");
            axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {

                        console.log("Venue Name: " + response.data[i].venue.name);
                        console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                        console.log("Date of the Event: " + response.data[i].datetime.replace("T", "\nStart at: "));
                        console.log("************************************************");
                    }
                })
        });
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
            if (answer.movie === "") {
                answer.movie = "Mr. Nobody";
                console.log("If you haven't watched Mr. Nobody, then you should! \nIt's on Netflix! \n************************************************");
            }
            axios.get(`http://www.omdbapi.com/?t=${answer.movie}/&y=&plot=short&apikey=trilogy`)
                .then(response => {
                    console.log("Title of the movie: " + response.data.Title);
                    console.log("Year the movie came out: " + response.data.Released);
                    console.log("IMDB Rating of the movie: " + response.data.imdbRating);
                    console.log("Rotten Tomatoes Rating of the movie: " + response.data.Rated);
                    console.log("Country where the movie was produced: " + response.data.Country);
                    console.log("Language of the movie: " + response.data.Language);
                    console.log("Plot of the movie: " + response.data.Plot);
                    console.log("Actors in the movie: " + response.data.Actors);
                    console.log("************************************************");

                })
        });
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
            if (answer.track === "") {
                answer.track = "The Sign";
            }
            spotify
                .search({ type: 'track', query: answer.track })
                .then(response => {
                    for (let track of response.tracks.items){
                    console.log("Artist: " + track.artists[0].name);
                    console.log("Song Name: " + track.name);
                    console.log("Preview Link: " + track.href);
                    console.log("Album: " + track.album.name);
                    console.log("************************************************");
                }
                })
                .catch(err => {
                    throw err;
                })
        })
}
require("dotenv").config();
const keys = require("./keys.js");
// const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const inquirer = require("inquirer");

inquirer
    .prompt([
        {
            name: "command",
            type: "list",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            message: "Choose the comand"
        }
    ])
    .then(choice => {
        console.log(choice.command);
        if (choice.command === "concert-this") { initiateSearchForBand(); }
        else if (choice.command === "movie-this") { initiateSearchForMovie(); }
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
                return initiateSearch();
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
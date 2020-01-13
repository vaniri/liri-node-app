require("dotenv").config();
const keys = require("./keys.js");
// const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const inquirer = require("inquirer");

function initiateSearch () {
    inquirer
  .prompt([
    {
      name: "band",
      type: "input",
      message: "What band you are looking for?"
    }
  ])
  .then(answer => {
    if(answer.band === "") { 
        console.log("Please enter a band!");
        return initiateSearch(); 
    }
      let band = answer.band.replace(" ", "+");
      axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
        .then(response => {
            for (let i = 0; i < response.data.length; i++) {

                console.log("Venue Name: "+ response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date of the Event: " + response.data[i].datetime.replace("T", "\nStart at: "));
                console.log("************************************************");
            }
    })
});
}

initiateSearch();
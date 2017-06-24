//Global Variables ///////////////////////////////

var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var omdb = require('request');
var fs = require('fs');
var input = process.argv[2];
var media = "";


//Functions //////////////////////////////////////

//Last 20 Tweets Function
function myTweets() {

    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = { screen_name: "@saul_peques", count: '20' };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error;
        for (i = 0; i < tweets.length; i++) {
            console.log("\nPosted on: " + tweets[i].created_at);
            console.log("\tTweet: " + tweets[i].text);
        }
    });
}

//Spotify Function
function spotifyCall(songString) {

    var client = new spotify({
        id: keys.spotifyKeys['client_id'],
        secret: keys.spotifyKeys['client_secret']
    });

    const defaultSong = 'Thunderstruck';
    const defaultArtist = 'ACDC';

    if (songString === "") {
        songString = defaultArtist + " & " + defaultSong;
    }

    var params = { type: "track", query: songString };

    client.search(params, function(error, data) {
        if (error) {
            return console.log("Error");
        } else {
            console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
            console.log("\nAlbum: " + data.tracks.items[0].album.name);
            console.log("\nSong: " + data.tracks.items[0].name);
            console.log("\nLink: " + data.tracks.items[0].preview_url);
        }

    });

}

//Movie This Function
function omdbCall(media) {

    var apiKey = keys.omdbKeys.api_key;

    const defaultMovie = 'Mr. Nobody';

    if (media === "") {
        media = defaultMovie;

    }

    var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + media;
    var client = new omdb(queryURL, function(error, response, body) {

        if (error) {
            return console.log("Error");
        } else {
            var a = JSON.parse(body);
            console.log("\nTitle: " + a.Title);
            console.log("\nYear: " + a.Year);
            console.log("\nIMDB Rating: " + a.imdbRating);
            console.log("\nCountry: " + a.Country);
            console.log("\nLanguage: " + a.Language);
            console.log("\nPlot: " + a.Plot);
            console.log("\nActors: " + a.Actors);
            console.log("\nRotten Tomatoes Score: " + a.Ratings[1].Value);
        }
    });

}

//Do What It Says
function doIt() {

    fs.readFile('random.txt', 'utf8', function(error, data) {
                if (error) {
                    return console.log("Error");
                } else {
                    data.split(",");
                    var b = data.split(",");
                }

                if (b.length < 2) {
                	input = b[0].substring(0, b[0].length - 1);
                } else {
                	input = b[0];
                	media = b[1].substring(0, b[1].length - 1);
                }

                switch (input) {
                    case "my-tweets":
                        myTweets();
                        break;

                    case "spotify-this-song":
                        spotifyCall(media);
                        break;

                    case "movie-this":
                        omdbCall(media);
                        break;
                }
            });
    }



//Switch Function Calls //////////////////////////
 switch (input) {

    case "my-tweets":
         	myTweets();
         	break;

    case "spotify-this-song":
         	for (i = 3; i < process.argv.length; i++) {
            	 media += (process.argv[i] + " ");
         	}
         	spotifyCall(media);
         	break;

    case "movie-this":
         	for (i = 3; i < process.argv.length; i++) {
             	media += (process.argv[i] + " ");
         	}
         	omdbCall(media);
         	break;

    case "do-what-it-says":
         	doIt();
         	break;

}
     

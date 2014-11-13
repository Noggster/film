// Including libraries
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    http = require('http'),
    fs = require('fs'),
    data = require('../reviews/config');

// This is the port for our web server.
app.listen(1337);

// If the URL of the socket server is opened in a browser
function handler (request, response) {

}

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

});

var settings = {
    configPath : '../reviews/config.json',
    jsonPath : '../reviews/reviews.json',
    imdbApi : 'omdbapi.com',
    pollTime : 60000 // 60000ms = 10minutes
};

console.log( 'server up and running! running initial import in: ' + settings.pollTime / 60000 + ' minutes' );

var reviewsJson = {
    movies : []
};

var timesDataFetched = 0;

function mergeData( userTitle, userReview, imdbId, length ) {
    var options = {
        host: settings.imdbApi,
        port: 80,
        path: '/?i=' + imdbId,
        method: 'POST'
    };

    http.request(options, function(res) {
        res.setEncoding( 'utf8' );
        res.on('data', function ( data ) {

            timesDataFetched++;

            var obj = JSON.parse(data);
            var review = {
                title: obj.Title,
                review: userReview,
                year: obj.Year,
                runtime: obj.Runtime,
                poster: obj.Poster,
                imdbRating: obj.imdbRating
            }
            reviewsJson.movies.push( review );

            if(timesDataFetched == length) {
                writeToFile();
            }
        });
    }).end();
}

setInterval( updateJSON, settings.pollTime );

function updateJSON() {
    for( var i = 0; i < data.reviews.length; i++ ) {
        var currentIndex = data.reviews[i];

        mergeData( currentIndex.title, currentIndex.review, currentIndex.imdbId, data.reviews.length );
    }
}

function writeToFile() {
    timesDataFetched = 0;

    fs.writeFile(settings.jsonPath, JSON.stringify(reviewsJson), function( err, data ) {
        if (err) {
            return console.log(err);
        }

        console.log( 'filed saved, running next import in: ' + settings.pollTime / 60000 + ' minutes');
    });
}
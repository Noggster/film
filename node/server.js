// Including libraries
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    http = require('http'),
    fs = require('fs'),
    data = require('../reviews/config'); // This should point to your .js file containing reviews

// This is the port for our web server.
app.listen(1337);

// If the URL of the socket server is opened in a browser
function handler (request, response) {

}

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

});

var settings = {
    jsonPath : '../reviews/reviews.json', // Change me to path of your .json output
    imdbApi : 'omdbapi.com',
    pollTime : 600000 // 600000ms = 10minutes
};

console.log( 'server up and running! running initial import in: ' + settings.pollTime / 60000 + ' minutes' );

var reviewsJson = {
    movies : []
};

var timesDataFetched = 0;

var Review = function( obj, userReview ) {
    var obj = JSON.parse(obj);

    this.title = obj.Title;
    this.review = userReview.review;
    this.year = obj.Year;
    this.runtime = obj.Runtime;
    this.poster = obj.Poster;
    this.imdbRating = obj.imdbRating;
}

function getImdbData( review, i ) {
    var options = {
        host: settings.imdbApi,
        port: 80,
        path: '/?i=' + review.imdbId,
        method: 'GET'
    };

    http.request(options, function(res) {
        res.setEncoding( 'utf8' );
        res.on('data', function ( data ) {
            var obj = JSON.parse(data);

            reviewsJson.movies.push( new Review( data, review ) );
            updateJSON( i+1 );
        });
    }).end();
}

//setInterval( updateJSON, settings.pollTime );

function updateJSON( i ) {
    i = i || 0;
    if ( data.reviews[i]) {
        getImdbData(data.reviews[i], i);
    } else {
        writeToFile();
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

    setTimeout(updateJSON, settings.pollTime);
}

updateJSON();
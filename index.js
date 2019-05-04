const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const server  = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 8888;
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '614f59b5380042b1b5fa3c4c275ba035';
const clientSecret = '6792d680cb8343caa6786bd5e4cee1ea';

const SerialPort = require('serialport');
const Readline   = require('@serialport/parser-readline');
const sPort      = new SerialPort('/dev/cu.usbmodem143101', { baudRate: 115200 });
const parser     = sPort.pipe(new Readline({ delimiter: '\n' }));

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

io.on('connection', function (socket) {
    console.log("New socket client connection: ", socket.id);
});

sPort.on("open", () => {
    console.log('Serial port open.');
});

// Create the api object with the credentials
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

        /* ----------------------
        * MAKE API REQUESTS HERE
        */
        spotifyApi.searchTracks('Love')
            .then(function(data) {
                console.log('Search by "Love"', data.body);
                io.emit('spotifyTracks', data.body);
            }, function(err) {
                console.error(err);
            });
        /* --------------------- */
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

// --------------------------------------------------------
// Our parser streams the incoming serial data
parser.on('data', function(data) {
  console.log(data);
  io.emit('data', { pulseData : data });
});

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

server.listen(PORT, () => {
    console.log('Listening on PORT ' + PORT);
});

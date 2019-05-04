const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '614f59b5380042b1b5fa3c4c275ba035';
const clientSecret = '6792d680cb8343caa6786bd5e4cee1ea';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});



// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    /* ----------------------
     * MAKE API REQUESTS HERE
     */
    // Get Elvis' albums
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
        .then(
            (data) => {
                console.log('Artist albums', data.body);
            },
            (err) => {
                console.error(err);
            }
        );
    /* --------------------- */
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

app.listen(8888);
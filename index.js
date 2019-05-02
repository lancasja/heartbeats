/**
 * Import express and make it available
 * Express is a web framework for node
 * https://expressjs.com/
 */
const express = require('express');
/**
 * Instantiate express and name it 'app'
 */
const app = express();
/**
 * Define which port to connect to
 */
const PORT = 3000;

/**
 * Once started, have app listen to requests on PORT
 */
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

/**
 * Tell app where your public/static files are
 */
app.use(express.static('public'));

/**
 * Define a way for a browser to make a request to this server
 * Do this with routes, these are the buildin blocks of APIs
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req, res) => {
    let cats = ['Siamese', 'Sheppard', 'Poofy'];
    let dogs = ['German Sheppard', 'Golden Retriever', 'Hound'];

    const { species } = req.query;

    switch (species) {
        case 'cats':
            res.send(cats);
            break;
        case 'dogs':
            res.send(dogs);
            break;
        default:
            res.send('Unknown species');
            break;
    }
});


import SpotifyWebApi = require('spotify-web-api-node');
import config from 'config';

const credentials = config.get('credentials') as any /* Credentials */;

const spotify = new SpotifyWebApi(credentials);
console.log(spotify);

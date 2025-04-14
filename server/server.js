const express = require("express");
const connectDB = require("./db")
require('dotenv').config()
const User = require('./models/User')

const request = require('request');
const axios = require('axios');
const cors = require("cors");
const querystring = require('querystring');
const crypto = require('crypto');
var cookieParser = require('cookie-parser');

const corsOptions = {
    origin: "http://localhost:5173"
}
const redirect_uri = 'http://localhost:8080/callback';


const Port = process.env.Port || 8080;
const ClIENT_ID = process.env.ClIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET
let spotifyToken = null;
let UserToken = null

const app = express();
app.use(express.json());

connectDB();

app.listen(Port,()=>{
  console.log(`Server started on port ${Port}`)
})

app.use(cors(corsOptions)).use(cookieParser());







app.get("/api", (req,res) => {
    res.json({fruits: ['apple,','orange']})
});





const getSpotifyToken = (callback) => {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };
  
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        spotifyToken = body.access_token;
        console.log("New Spotify token:", spotifyToken);
        callback(null, spotifyToken);
      } else {
        console.error("Error fetching token:", error);
        callback(error, null);
      }
    });
  };

 

  const ensureSpotifyToken = (req, res, next) => {
    if (spotifyToken ) {
      next();
    } else {
      getSpotifyToken((err, token) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch Spotify token" });
        }
        next();
      });
    }
  };


app.get('/spotify-search',ensureSpotifyToken, async (req, res) => {
    const searchQuery = req.query.q;
    const type = req.query.type;
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${spotifyToken}` },
            params: { q: searchQuery, type: type }
        });
        res.json(response.data);
        
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

var stateKey = 'spotify_auth_state';


const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize?';
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';
  res.cookie(stateKey, state);
  
  res.redirect(SPOTIFY_AUTH_URL +
    querystring.stringify({
      response_type: 'code',
      client_id: ClIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

    
});

app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(ClIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
      // Handle errors (e.g., invalid code)
      request.get(options, function(error, response, body) {
        console.log(body);
        const spotify_id = body.id
      });
      res.redirect('http://localhost:5173/#'+ querystring.stringify({
        access_token: access_token,
        refresh_token: refresh_token
      }));
    }
    
    else{
      res.redirect('http://localhost:5173/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));

    }
    
    
    
    });
  });
  
app.get('/getProfile', async (req, res) => {
    const token = req.query.q
    var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + token }
    };
    // Handle errors (e.g., invalid code)
    try{
      const response = await axios.get(options.url, { headers: options.headers })
      res.json(response.data)
    }catch(error){
      res.status (500).json({error:error.message})
    }
   

});



// Start the server

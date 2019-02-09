const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const expressValidator = require('express-validator')
const register = require('./src/controllers/register');
const signIn = require('./src/controllers/signIn');
const image = require('./src/controllers/image');
const profile = require('./src/controllers/profile');
const auth = require('./src/middleware/authorization');

const path = require('path');
const app = express();
require('dotenv').config();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
const redis = require('redis');
const client = redis.createClient({
    host: 'localhost'
});

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const devdb = {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'testa',
    database: 'face-match'
}

// const db = {
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// }

// const prodDB = {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true
// }

const knex = require('knex')({
    client: 'pg',
    connection: devdb
});

knex.select('*').from('users').then(data => console.log(data));

// app.get('/', (req, res) => {
//     res.send(database.users)
// })

app.post('/signin', (req, res) => signIn.signinAuth(req, res, knex, bcrypt, client));
app.post('/register', (req, res) => register.handleRegister(req, res, knex, bcrypt, client));
app.get('/profile/:id', auth.requireAuth(client), (req, res) => profile.handleGetProfile(req, res, knex));
app.post('/profile/:id', auth.requireAuth(client), (req, res) => profile.handleProfileUpdate(req, res, knex));
app.put('/image', auth.requireAuth(client), (req, res) => image.handleImage(req, res, knex));
app.post('/imageurl', auth.requireAuth(client), (req, res) => image.handleApiCall(req, res));

const PORT = 8080;

app.listen(8080, () => {
    console.log(`app is running on port ${PORT}`)
});
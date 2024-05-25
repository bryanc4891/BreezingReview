const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')
const dotenv = require('dotenv')


const app = express();

app.use(express.json());

app.use(express.urlencoded());

app.use(cors());

// app.use(dotenv.config);

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.post('/meeting', (req, res) => {

    axios.post(`${process.env.MEETUP_ENDPOINT}/prod/email/isWorking`, {}, {
        headers: {
            'x-api-key': process.env.API_KEY
        }
    })
    .then(response => console.log('response', response))
    .catch(error => console.log(error));

    res.send({
        code: 200,
        message: 'It worked',
        request: req.body
      }) ;
});

app.get('/meeting', (req, res) => {
    res.send("hello") ;
 });

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
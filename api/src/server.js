const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv').config;
const moment = require('moment');


const app = express();

app.use(express.json());

app.use(express.urlencoded());

app.use(cors());

// app.use(dotenv.config);

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.post('/meeting', (req, res) => {

    axios.post(`${process.env.MEETUP_ENDPOINT}/prod/meetup/addMeetup`, 
        {
            organiserid : req.body.organiser,
            placeid: req.body.place,
            timeofmeeting: req.body.datetime,
            attendeeids: req.body.attendees
        }, {
        headers: {
            'x-api-key': process.env.API_KEY
        }
    })
    .then(response => {
        console.log("data", response.data);
        console.log(`${process.env.MEETUP_ENDPOINT}/prod/meetup/getMeetup?meetupId=${response.data}`);
        axios.get(`${process.env.MEETUP_ENDPOINT}/prod/meetup/getMeetup?meetupId=${response.data}`, { 
            headers: {
                'x-api-key': process.env.API_KEY
            }
        })
    })
    .then(response => console.log("get response", response))
    .catch((error) => {
        console.log(error)
        return res.send({
            code: 503,
            message: 'Something went wrong',
            request: req.body
        })
    })    
});

app.get('/meeting', (req, res) => {
    res.send("hello") ;
 });

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
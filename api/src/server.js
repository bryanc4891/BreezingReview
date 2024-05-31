const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors')
const axios = require('axios')


const app = express();

app.use(express.json());

app.use(express.urlencoded());

app.use(cors());

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

app.post('/delete-user', async (req, res) => {
    const params = new URLSearchParams({userid: req.body.userid});
    try {
        const apiResponse = await axios.post(`${process.env.USER_ENDPOINT}/prod/user/deleteUser?${params.toString()}`, {}, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        });
        res.status(200).send(apiResponse.data);
    } catch (apiError) {
        console.error('Failed to delete user on external API:', apiError);
        res.status(500).send('Failed to delete user');
    }
});

app.get('/meeting', (req, res) => {
    res.send("hello") ;
 });

app.get('/geoinfo', async (req, res) => {
    try {
        const response = await axios.get(`https://ipinfo.io/json?token=${process.env.IP_INFO_TOKEN}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch IP info:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

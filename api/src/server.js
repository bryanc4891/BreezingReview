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
    // console.log("process", process.env);
    // console.log("\n\n\n\n\n\n\n");
    // console.log('request', req.body);
    // console.log("Date parse\n\n\n\n\n", new Date(req.body.datetime));
    // console.log("Date parse\n\n\n\n\n", Date.parse(req.body.datetime));
    // const submitDate = new Date(Date.parse(req.body.datetime)).toISOString()
    const submitDate = moment(new Date(req.body.datetime));

    axios.post(`${process.env.MEETUP_ENDPOINT}/prod/meetup/addMeetup`, 
        {
            organiserid : "28e10380-c071-7064-a3bb-11a78a0df5bc",
            placeid: '1235234',
            timeofmeeting: submitDate.format('YYYY-MM-DD HH:mm:ss'),
            attendeeids: "284113a0-70f1-7045-755a-eda39a7772b9, 58416370-e0d1-7018-3570-4a0dd549d684"
        }, {
        headers: {
            'x-api-key': process.env.API_KEY
        }
    })
    .then(response => console.log("response\n\n\n", response))
    .catch(error => console.log("error\n\n\n", error))
    // .then(response => console.log('response', response))
    // .catch(error => console.log(error));

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
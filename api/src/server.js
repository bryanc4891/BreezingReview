import express from 'express'
import dotenv from 'dotenv'
import path from 'path';
import * as bodyParser from 'body-parser'
import cors  from 'cors'
import axios from 'axios';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

dotenv.config();

app.use(express.urlencoded());

app.use(cors());

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));

app.post('/api/meeting', (req, res) => {

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

app.post('/api/delete-user', async (req, res) => {
    const params = new URLSearchParams({userid: req.body.userid});
    try {
        const response = await axios.post(`${process.env.USER_ENDPOINT}/prod/user/deleteUser?${params.toString()}`, {}, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        });
        res.send(response.data);
    } catch (error) {
        console.error('Failed to delete user on external API:', error);
        res.send({
            statusCode: 500,
            message: 'Failed to delete user'
        });
    }
});

app.post('/api/add-review', (req, res) => {
    axios.post(`${process.env.REVIEW_ENDPOINT}/prod/review/addReview`, req.body, {
        headers: {
            'x-api-key': process.env.API_KEY
        }
    }).then(response => {
        res.send({
            statusCode: 200,
            message: 'New review added successfully'
        });
    }).catch(error => {
        console.error('Failed to add new review:', error);
        res.send({
            statusCode: 500,
            message: 'Failed to add new review'
        });
    });
});

app.get('/api/check-place', (req, res) => {
    axios.get(`${process.env.PLACE_ENDPOINT}/prod/place/getPlace`, {
        params: {
            placeid: req.query.placeid
        },
        headers: {
            'x-api-key': process.env.API_KEY
        }
    }).then(response => {
        if (response.data.length === 0) {
            // Place does not exist, proceed with POST request to create a new place
            axios.post(`${process.env.PLACE_ENDPOINT}/prod/place/addPlace`, req.query, {
                headers: {
                    'x-api-key': process.env.API_KEY
                }
            }).then(postResponse => {
                res.send({
                    statusCode: 200,
                    message: 'New place added successfully'
                });
            }).catch(postError => {
                console.error('Failed to add new place:', postError);
                res.send({
                    statusCode: 500,
                    message: 'Failed to add new place'
                });
            });
        } else {
            // Place already exists, log and respond accordingly
            console.log('Place already exists');
            res.send({
                statusCode: 200,
                message: 'Place already exists'
            });
        }
    }).catch(error => {
        console.error('Failed to fetch place info:', error);
        res.send({
            statusCode: 500,
            message: 'Failed to fetch place'
        });
    });
});

app.get('/api/heatmap-data', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.REVIEW_ENDPOINT}/prod/review/getHeatmapData`, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        })
        res.send({
            statusCode: 200,
            message: response.data
        });
    } catch (error) {
        console.error('Failed to fetch IP info:', error);
        res.send({
            statusCode: 500,
            message: 'Failed fetch reviews'
        });
    }
});

app.get('/api/geoinfo', async (req, res) => {
    try {
        const response = await axios.get(`https://ipinfo.io/json?token=${process.env.IP_INFO_TOKEN}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch IP info:', error);
        res.json({ message: 'Failed to fetch geoinfo' });
    }
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

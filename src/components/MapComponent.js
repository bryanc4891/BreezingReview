import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import axios from 'axios';
import { useUserProfile } from '../contexts/UserContext';

const MapComponent = () => {
    const userProfile = useUserProfile();
    const addPlaceUrl = "https://q5u6co31a9.execute-api.us-west-2.amazonaws.com/prod/place/addPlace";
    const addReviewUrl = "https://sagfsdru31.execute-api.us-west-2.amazonaws.com/prod/review/addReview"
    const getPlaceUrl = "https://q5u6co31a9.execute-api.us-west-2.amazonaws.com/prod/place/getPlace";
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    // Function to generate random points around a place
    const generateRandomPoints = (center, numPoints, maxDistance, maxIntensity) => {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxDistance;
            const lat = center[0] + (distance / 111) * Math.cos(angle); // 111 km per degree of latitude
            const lng = center[1] + (distance / (111 * Math.cos(center[0] * (Math.PI / 180)))) * Math.sin(angle); // Adjust for longitude
            const intensity = Math.random() * maxIntensity;
            points.push([lat, lng, intensity]);
        }
        return points;
    };

    function addHeatLayer(map) {
        // Generate N random points around Bellevue with intensity between 0 and 1
        const heatData = generateRandomPoints([47.610378, -122.200676], 1000, 5, 1);

        // Add the heat layer to the map
        L.heatLayer(heatData, {
            radius: 25,      // Radius of each “point” of the heatmap
            blur: 15,        // Amount of blur
            maxZoom: 18      // Zoom level at which the points reach maximum intensity
        }).addTo(map);
    }

    async function fetchUserLocation() {
        // Fetch user's location based on IP, default to Bellevue if not found
        let userLat = 47.610378;
        let userLng = -122.200676;

        try {
            const response = await axios.get('http://localhost:8000/geoinfo');
            const loc = response.data.loc.split(',');
            userLat = parseFloat(loc[0]);
            userLng = parseFloat(loc[1]);
        } catch (error) {
            console.error('Error fetching location from server:', error);
        }

        return {userLat, userLng};
    }


    window.ratePlace = async (userId, rating, lat, lng, placeId, placeName, cityName) => {
        const created_at = new Date().toISOString() // Get UTC timestamp in ISO 8601 format
        console.log(`User: ${userId}, Rating: ${rating}, City: ${cityName}, Place: ${placeName}, PlaceID: ${placeId}, Latitude: ${lat}, Longitude: ${lng}, CreatedAt: ${created_at}`);
        const review = rating === 'Good' ? 1 : 0;
        const placeBody = {
            placename: placeName,
            placeid: placeId,
            placelongitude: lng,
            placelatitude: lat,
            placecity: cityName
        };
        const reviewBody = {
            userid: userId,
            placeid: placeId,
            review: review,
            reviewedat: created_at
        };
        let getPlaceResult = await getPlace(getPlaceUrl, placeId);
        console.log(getPlaceResult);
        console.log(getPlaceResult.length);
        if(getPlaceResult.length === 0) {
            await insertData(addPlaceUrl, placeBody);
            await insertData(addReviewUrl, reviewBody);
        } else {
            await insertData(addReviewUrl, reviewBody);
        }
        window.alert("Succeessfully Reviewed");
        mapRef.current.closePopup();
        console.log("REVIEW SUCCESS ");
    };

    async function getPlace(url, placeId) {
        try {
            url = url + "?placeid=" + placeId;
            console.log(url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.json();
        } catch (e) {
            console.log("Error in getPlace: ", e);
            return null;
        }
    }

    async function insertData(url, data) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (e) {
            console.log("Error in inserting Data: ", e);
            return null;
        }
    }

    window.scheduleMeeting = (placeId, lat, long) => {
        window.location.href = `/meeting/?placeID=${placeId}&lat=${lat}&long=${long}`
    }

    function addPopupOnMap(map) {
        // user making reviews
        map.on('click', async function (e) {
            const lat = e.latlng.lat;
            let lng = e.latlng.lng;
            lng = ((lng + 180) % 360) - 180; // Correct the longitude
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            if (!response.ok) {
                console.error('Failed to fetch data from Nominatim:', response.statusText);
                return;
            }
            const data = await response.json();
            // console.log(data);
            const placeId = data.place_id;
            const placeName = data.name || data.display_name;
            const cityName = data.address?.city || 'Not available';

            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div>
                        <p>Location: ${placeName}</p>
                        <button onclick="window.ratePlace('${userProfile.sub}', 'Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Good</button>
                        <button onclick="window.ratePlace('${userProfile.sub}', 'Not Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Not Good</button>
                        <button onclick="window.scheduleMeeting('${placeId}', '${lat}', '${lng}')">Schedule Meetup</button>
                    </div>
                `)
                .openOn(map);
        });
    }

    const fetchLocationAndInitializeMap = async () => {

        let {userLat, userLng} = await fetchUserLocation();
        const map = L.map(mapContainerRef.current, {
            center: [userLat, userLng],
            zoom: 13
        });
        mapRef.current = map; // Store reference to the map instance
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        addHeatLayer(map);
        // console.log(map);
        addPopupOnMap(map);
    };

    useEffect(() => {
        // console.log("In use effect");
        fetchLocationAndInitializeMap();
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        }
    },  []);

    return <div className="map-container">
          <div ref={mapContainerRef} style={{ height: '100vh' }} id="map"></div>
    </div>;
};

export default MapComponent;

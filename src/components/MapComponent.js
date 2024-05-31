import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import axios from 'axios';
import { useUserProfile } from '../contexts/UserContext';

const MapComponent = () => {
    const userProfile = useUserProfile();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    async function addHeatLayer(map) {
        const heatDataRes = await axios.get('http://localhost:8000/heatmap-data');
        if (heatDataRes.data.statusCode === 200) {
            // Add the heat layer to the map
            L.heatLayer(JSON.parse(heatDataRes.data.message.body), {
                radius: 25,      // Radius of each “point” of the heatmap
                blur: 15,        // Amount of blur
                maxZoom: 18      // Zoom level at which the points reach maximum intensity
            }).addTo(map);
        } else {
            console.log(heatDataRes.data)
        }
    };

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

        const getPlaceResult = await axios.get('http://localhost:8000/check-place', {
            params: {
                placename: placeName,
                placeid: placeId,
                placelongitude: lng,
                placelatitude: lat,
                placecity: cityName
            },
        });
        console.log(getPlaceResult.data);

        const insertReviewResult = await axios.post('http://localhost:8000/add-review', {
            userid: userId,
            placeid: placeId,
            review: rating === 'Good' ? 1 : 0,
            reviewedat: created_at
        })
        console.log(insertReviewResult.data);
        mapRef.current.closePopup();
    };

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

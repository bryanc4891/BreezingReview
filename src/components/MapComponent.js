import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import axios from 'axios';
import TopPlaces from './TopPlaces';
import { useUserProfile } from '../contexts/UserContext';


const MapComponent = () => {
    const userProfile = useUserProfile();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [CityTopPlaces, setCityTopPlaces] = useState({city: 'Bellevue', places: []});
    const [topPlacesIsLoading, setTopPlacesIsLoading] = useState(true);

    async function addHeatLayer(map) {
        const heatDataRes = await axios.get('http://localhost:8000/heatmap-data');
        if (heatDataRes.data.statusCode === 200) {
            L.heatLayer(JSON.parse(heatDataRes.data.message.body), {
                radius: 25,
                blur: 15,
                maxZoom: 18
            }).addTo(map);
        } else {
            console.log(heatDataRes.data)
        }
    };

    function addPopupOnMap(map) {
        // user making reviews
        map.on('click', async function (e) {
            const lat = e.latlng.lat;
            const lng = ((e.latlng.lng + 180) % 360) - 180; // Correct the longitude
            await showPopup(lat, lng, map);
        });
    }

    async function showPopup(lat, lng, map) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data from Nominatim:', response.statusText);
            }
            const data = await response.json();

            const placeId = data.place_id;
            const placeName = data.name || data.display_name;
            const cityName = data.address?.city || 'Not available';

            L.popup()
                .setLatLng([lat, lng])
                .setContent(`
                <div>
                    <p>Location: ${placeName}</p>
                    <button onclick="window.ratePlace('${userProfile.sub}', 'Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Good</button>
                    <button onclick="window.ratePlace('${userProfile.sub}', 'Not Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Not Good</button>
                    <button onclick="window.scheduleMeeting('${placeId}', ${lat}, ${lng})">Schedule Meetup</button>
                </div>
            `).openOn(map);
        } catch (error) {
            console.error('Error fetching and displaying popup:', error);
        }
    }

    async function fetchUserLocation() {
        // Fetch user's location based on IP, default to Bellevue if not found
        let userLat = 47.610378, userLng = -122.200676;
        setTopPlacesIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/geoinfo');
            const userCity = response.data.city;
            const loc = response.data.loc.split(',');
            userLat = parseFloat(loc[0]);
            userLng = parseFloat(loc[1]);

            const topPlaces = await axios.get('http://localhost:8000/top-places', {params: {cityname: userCity}});
            setCityTopPlaces({city: userCity, places: topPlaces.data.message});
        } catch (error) {
            console.error('Error fetching location from server:', error);
        } finally {
            setTopPlacesIsLoading(false);
        }

        return {userLat, userLng};
    }

    const moveToLocation = (lat, lng) => {
        if (mapRef.current) {
            mapRef.current.setView([lat, lng], 15);
            showPopup(lat, lng, mapRef.current);
        }
    };

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

    const fetchLocationAndInitializeMap = async () => {

        const {userLat, userLng} = await fetchUserLocation();
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

    return (
        <div className="map-container">
            <div ref={mapContainerRef} style={{ height: '100vh' }} id="map"></div>
            {!topPlacesIsLoading && <TopPlaces items={CityTopPlaces.places} userCity={CityTopPlaces.city} onItemClick={moveToLocation}/>}
        </div>
    );
};

export default MapComponent;

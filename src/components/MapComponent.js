import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserProfile } from '../contexts/UserContext';

const MapComponent = () => {
    const userProfile = useUserProfile();
    const [ratedPlaces] = useState([
        { id: 1, lat: 47.610378, lng: -122.200676, rating: 'Good', name: 'Place One' },
        { id: 2, lat: 47.610978, lng: -122.201676, rating: 'Not Good', name: 'Place Two' }
        // Just a test here, for rendering community preferences
    ]);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        // console.log(userProfile)
        const fetchLocationAndInitializeMap = async () => {
            // Fetch user's location based on IP, default to Bellevue if not found
            let userLat = 47.610378;
            let userLng = -122.200676;

            try {
                const response = await fetch(`https://ipinfo.io/json?token=${process.env.REACT_APP_IP_INFO_TOKEN}`);
                if (response.ok) {
                    const data = await response.json();
                    const loc = data.loc.split(',');
                    userLat = parseFloat(loc[0]);
                    userLng = parseFloat(loc[1]);
                } else {
                    console.error('Failed to fetch location:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }

            // Proceed to initialize the map
            // Check if map already initialized
            if (mapRef.current) return; // Prevent reinitialization

            const map = L.map(mapContainerRef.current, {
                center: [userLat, userLng],
                zoom: 13
            });
            mapRef.current = map; // Store reference to the map instance
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Custom divIcon with FontAwesome
            const createIcon = (rating) => L.divIcon({
                className: 'custom-icon',
                html: `<i class="fa ${rating === 'Good' ? 'fa-thumbs-up' : 'fa-thumbs-down'}" style="color: ${rating === 'Good' ? 'green' : 'red'}; font-size: 24px; background: transparent;"></i>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -42]
            });

            // Projecting fav places or community preferences
            ratedPlaces.forEach(place => {
                const icon = createIcon(place.rating);
                const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
                marker.bindPopup(`<strong>${place.name}</strong><br>Rating: ${place.rating}`, { closeButton: false });
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
            });

            // Function to correct the longitude to be within -180 to 180 degrees
            function wrapLongitude(lng) {
                return ((lng + 180) % 360) - 180;
            }

            // user making reviews
            map.on('click', async function(e) {
                const lat = e.latlng.lat;
                let lng = e.latlng.lng;
                lng = wrapLongitude(lng); // Correct the longitude
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

                const popup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`
                        <div>
                            <p>Location: ${placeName}</p>
                            <button onclick="window.ratePlace('${userProfile.sub}', 'Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Good</button>
                            <button onclick="window.ratePlace('${userProfile.sub}', 'Not Good', ${lat}, ${lng}, ${placeId}, '${placeName}', '${cityName}')">Not Good</button>
                        </div>
                    `)
                    .openOn(map);
            });

            window.ratePlace = (userId, rating, lat, lng, placeId, placeName, cityName) => {
                const created_at = new Date().toISOString() // Get UTC timestamp in ISO 8601 format
                console.log(`User: ${userId}, Rating: ${rating}, City: ${cityName}, Place: ${placeName}, PlaceID: ${placeId}, Latitude: ${lat}, Longitude: ${lng}, CreatedAt: ${created_at}`);
            };
        };

        fetchLocationAndInitializeMap();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [ratedPlaces]); // Dependency array to control re-rendering

    return <div ref={mapContainerRef} style={{ height: '100vh' }} id="map"></div>;
};

export default MapComponent;

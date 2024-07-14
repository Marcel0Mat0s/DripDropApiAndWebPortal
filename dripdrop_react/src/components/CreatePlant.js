import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import {
    TextField, Select, MenuItem, FormControl, InputLabel, Button,
    Box, Typography, Grid, Container, Paper
} from "@mui/material";

// Custom icon for the marker
const plantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/1647/1647460.png', // Replace with your icon URL
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function LocationMarker({ setInputs }) {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            map.flyTo(e.latlng, map.getZoom());
            setPosition(e.latlng); // Update local state
            setInputs(values => ({ ...values, location: `${e.latlng.lat}, ${e.latlng.lng}` })); // Update parent state
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={plantIcon}>
            <Popup>Localização Selecionada: {position.lat}, {position.lng}</Popup>
        </Marker>
    );
}

export default function CreatePlant() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ location: "", name: "", type: "" });
    const [types, setTypes] = useState([]);
    const [mapCenter, setMapCenter] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        getTypes();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setMapCenter([lat, lon]);
                    setInputs((values) => ({ ...values, location: `${lat}, ${lon}` }));
                },
                (error) => {
                    console.error("Error getting geolocation: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    /**
       * Function to get the plant types from the API
       */
    function getTypes() {

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant types from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/null/${userId}`, config).then(function (response) {
            console.log(response.data);
            setTypes(response.data);

        }).catch(function (error) {
            console.log('Plant types retrieval failed: ', error)
        });

    }

    /**
     * Function to handle the change in the inputs
     * @param {*} event
     * @returns
     */
    const handleChange = (event) => {
        // gets the name and value of the input that changed
        const name = event.target.name;
        const value = event.target.value;

        // sets the new value in the inputs state
        setInputs(values => ({ ...values, [name]: value }));
    }

    /**
     * Function to handle the submit of the form
     * @param {*} event
     * @returns
     */
    const handleSubmit = (event) => {

        // prevents the default behavior of the form
        event.preventDefault();

        /////////////////////////////VALIDATIONS///////////////////////////////

        // checks if the user ID is available
        if (!userId) {
            console.error("No user ID available for request.");
            console.log("User ID: ", userId);
            return;
        }

        // checks if all the inputs are filled and valid
        if (!inputs.name || !inputs.location || !inputs.type) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        // checks if the location is in the correct format
        if (!inputs.location.includes(',')) {
            alert("A localização deve estar no formato 'latitude, longitude'.");
            return;
        }

        // Add the user ID to the inputs
        inputs.userId = userId;

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Prints the inputs to the console
        console.log(inputs);

        // sends the request to the API to create the plant
        axios.post(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}/save`, inputs, config).then(function (response) {
            console.log(response.data);

            // redirect to the plant page after creation to show the new plant id to the user
            navigate('/plant')
        })
            .catch(function (error) {
                console.log('Plant creation failed: ', error)
            })
    }

    return (
        <Container maxWidth="lg" mt={2}> {/* Container for layout */}
            <Grid container spacing={10} mt={2}> {/* Grid for layout */}

                {/* Left Card (Form) */}
                <Grid item xs={12} md={6}>
                    <div className="whiteFullCard"> {/* Left card container */}
                        <Typography variant="h5" component="h2" gutterBottom>
                            Adicionar planta
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Nome"
                                name="name"
                                fullWidth
                                value={inputs.name}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="type-label">Tipo</InputLabel>
                                <Select
                                    labelId="type-label"
                                    name="type"
                                    value={inputs.type}
                                    onChange={handleChange}
                                >
                                    {types.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            <TextField
                                label="Localização (lat, lng)"
                                name="location"
                                fullWidth
                                value={inputs.location}
                                onChange={handleChange}
                                margin="normal"
                                disabled // Disable direct input, get from map
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            > Adicionar </Button>
                        </form>
                    </div>
                </Grid>

                {/* Right Card (Map) */}
                <Grid item xs={12} md={6}>
                    <div className="whiteFullCard"> {/* Right card container */}
                        {mapCenter && (
                            <MapContainer
                                center={mapCenter}
                                zoom={12}
                                style={{ height: "500px" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker setInputs={setInputs} />
                            </MapContainer>
                        )}
                    </div>
                </Grid>
            </Grid>
        </Container>
    );


}



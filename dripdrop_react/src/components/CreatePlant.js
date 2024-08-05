import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { removeToken, removeUserId, removeRole } from "../redux/actions";

// Custom icon for the marker
const plantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/1647/1647460.png', // Replace with your icon URL
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

/**
 * 
 * Component to create a marker on the map
 * 
 * @param {*} setInputs
 * 
 * @returns 
 */
function LocationMarker({ setInputs }) {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            map.flyTo(e.latlng, map.getZoom());
            setPosition(e.latlng); // Update local state
            setInputs(values => ({ ...values, location: `${e.latlng.lat}, ${e.latlng.lng}` }));
        },
    });

    // Returns the marker on the map if the position is not null
    return position === null ? null : (
        <Marker position={position} icon={plantIcon}>
            <Popup>Localização Selecionada: {position.lat}, {position.lng}</Popup>
        </Marker>
    );
}

export default function CreatePlant() {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ location: ""});
    const [types, setTypes] = useState([]);
    const [mapCenter, setMapCenter] = useState(null);

    const userId = localStorage.getItem("userId");

    // gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    const dispatch = useDispatch();

    useEffect(() => {
        
        getTypes();

        // Checks if the browser supports geolocation
        if (navigator.geolocation) {
            // Gets the current position of the user
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    // Sets the map center to the user's location
                    setMapCenter([lat, lon]);
                    // Sets the location in the inputs
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
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/null/${userId}///${role}`, config).then(function (response) {
            console.log(response.data);
            setTypes(response.data);

        }).catch(function(error){
            console.log(error);
            // ends the session if the token is invalid
            // Remove the token from the redux store and local storage
            dispatch(removeToken());
            localStorage.removeItem('token');

            // Remove the user id from the redux store and local storage
            dispatch(removeUserId());
            localStorage.removeItem('userId');

            // Remove the role from the redux store and local storage
            dispatch(removeRole());
            localStorage.removeItem('role');

            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
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
        axios.post(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}/save//${role}`, inputs, config).then(function (response) {
            console.log(response.data);

            // redirect to the plant page after creation to show the new plant id to the user
            navigate('/plant')
        }).catch(function(error){
            console.log(error);
            alert("Erro ao criar a planta. Por favor tente novamente.");
        });
    }

    return (
        <div class="d-flex items-align-center">
            <div class="row p-0 w-100">

                <div class="col m-5 whiteFullCard">
                    
                    <div class="h-25">
                        <h1 align="center">Crie uma nova planta!🪴</h1>
                        <br/>
                        <hr class="hr hr-blurry" />
                        <br/>
                    </div>
                    <div class="h-75">
                        <form onSubmit={handleSubmit}>
                            <table align="center" class="text-light w-75">
                                <thead>
                                    <tr>
                                        <td class="text-dark">
                                            <h2 align="left">Preencha os campos:</h2>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div class="form-floating mb-3">
                                        <input id="floatingName" class="form-control" type="name" name="name" onChange={handleChange} placeholder="nome"/>
                                        <label for="floatingName">Nome</label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <select id="floatingType" class="form-select p-3" aria-label="Floating label select example" name="type" onChange={handleChange}>
                                            <option value="">Selecione um tipo</option>
                                            {types.map((type) => 
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingLocation" class="form-control" type="text" name="location" value={inputs.location} onChange={handleChange}/>
                                        <label for="floatingLocation">Localização (lat, lng)</label>
                                    </div>

                                    <div align="right">
                                        <button class="btn btn-outline-success" type="submit">
                                            Adicionar
                                        </button>
                                    </div>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>

                <div class="col m-5 p-3 whiteFullCard">
                        {mapCenter && (
                            <MapContainer
                                center={mapCenter}
                                zoom={12}
                                style={{ height: "100%", borderRadius: "50px" }}
                            >
                                <TileLayer 
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker setInputs={setInputs} />
                            </MapContainer>
                        )}
                </div>
            </div>
        </div>
    );
}



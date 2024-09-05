import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { removeToken, removeUserId, removeRole } from "../redux/actions";

// Custom icon for the marker
const plantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/1647/1647460.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

/**
 * 
 * Component to create a marker on the map
 * 
 * @param {*} setInputs
 * @param {*} initialPosition
 * 
 * @returns 
 */
function LocationMarker({ setInputs, initialPosition }) {
    const [position, setPosition] = useState(initialPosition);
    
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

// View to edit a plant
export default function EditPlant(){

    // inicializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs and types states
    const [inputs, setInputs] = useState([]);
    const [types, setTypes] = useState([]);
    const [mapCenter, setMapCenter] = useState(null);

    // gets the plant ID from the URL
    const {id} = useParams();

    // Gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // Gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // initializes the dispatch function
    const dispatch = useDispatch();

    // get the plant types and the plant data from the API when the page loads
    useEffect(() => {
        getTypes();
        getPlant();
    }, []);

    /**
     * Gets the plant types from the API
     *
     * @returns
     */
    function getTypes(){

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant types from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/null/${userId}`, config).then(function(response){
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
     * function to get the plant data from the API
     * 
     * @returns
     */
    function getPlant(){

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}`, config).then(function(response){
            console.log(response.data)
            setInputs(response.data)

            // Extract the saved location and set the map center and initial position for the marker
            const location = response.data.location.split(", ");
            const lat = parseFloat(location[0]);
            const lon = parseFloat(location[1]);
            setMapCenter([lat, lon]);
        }).catch(function(error){
            console.log(error);
            // ends the session if the token is invalid
            // Remove the token from the redux store and local storage
            dispatch(removeToken());
            localStorage.removeItem('token');

            // Remove the user id from the redux store and local storage
            dispatch(removeUserId());
            localStorage.removeItem('userId');
            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
        });
    }

    /** 
     * Function to handle the change in the inputs
     * 
     * @param {*} event
     * @returns
     */
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    /**
     * Function to handle the submit of the form
     *  
     * @param {*} event
     * @returns
     */
    const handleSubmit = (event) => {

        // prevents the default behavior of the form
        event.preventDefault();

        console.log(inputs);

        ///////////////////////////// Validations /////////////////////////////

        // checks if all the fields are filled
        if(!inputs.name || !inputs.location || !inputs.type){
            alert('Por favor preencha todos os campos');
            return;
        }

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Sends the data to the API to update the plant
        axios.put(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}/edit`, inputs, config).then(function(response){
            console.log(response.data);
           
            if (role === 'admin') {
                navigate(`/user/${inputs.fk_user}/plants`);
            } else {
                navigate('/plants');
            } 
            alert('Planta atualizada com sucesso!');
        })
        .catch(error => {
            console.log('Failed to update user: ', error);
            alert('Erro ao atualizar a planta. Por favor tente novamente.');
        });
    }

    return(
        <div class="d-flex items-align-center">
            <div class="row p-0 w-100">

                <div class="col m-5 whiteFullCard">
                    <div class="h-25">
                        <h1 align="center">Edite a sua plantação!🪴</h1>
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
                                            <h2 align="left">Edite os campos:</h2>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody >
                                    <div class="form-floating mb-3">
                                        <input id="floatingName" class="form-control" value={inputs.name} type="text" name="name" onChange={handleChange} placeholder="nome"/>
                                        <label for="floatingName">Nome</label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="location" class="form-control" type="text" name="location" value={inputs.location} onChange={handleChange} disabled/>
                                        <label for="location">Localização (lat, long)</label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <select class="form-select p-3" aria-label="Floating label select example" name="type" value={inputs.type} onChange={handleChange}>
                                            <option value="">Selecione um tipo</option>
                                            {types.map((type) => 
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            )}
                                        </select>
                                    </div>
                                    <br/>
                                    <tr>
                                        <td class="d-flex bd-highlight">
                                            {role === 'admin' ? (
                                                <a align="left" href={`/user/${inputs.fk_user}/plants`} class='btn btn-outline-danger p-2 bd-highlight'>Cancelar</a>
                                            ) : (
                                                <a align="left" href={`/states/${id}/${inputs.type}/${inputs.name}`} class='btn btn-outline-danger p-2 bd-highlight'>Cancelar</a>
                                            )}
                                            <button align="right" class='btn btn-outline-success ms-auto p-2 bd-highlight'>Guardar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>

                <div class="col m-5 p-3 whiteFullCard" style={{ minWidth: "300px"}}>
                        {mapCenter && (
                            <MapContainer
                                center={mapCenter}
                                zoom={12}
                                style={{ height: "100%", borderRadius: "50px" }}
                            >
                                <TileLayer 
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker setInputs={setInputs} initialPosition={mapCenter} />
                            </MapContainer>
                        )}
                </div>
            </div>
        </div>
    )
}
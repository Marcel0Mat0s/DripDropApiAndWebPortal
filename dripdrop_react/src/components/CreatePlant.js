import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

// View to create a plant
export default function CreatePlant(){

    // inicializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs and types states
    const [inputs, setInputs] = useState({location: ''})
    const [types, setTypes] = useState([])

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    /**
     * gets the plant types and the user location when the page loads
     */
    useEffect(() => {

        // gets the plant types from the API
        getTypes();

        // if the browser supports geolocation, gets the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Set the location in the Location input
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
    function getTypes(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
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
            console.log('Plant types retrieval failed: ',error)
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
        setInputs(values => ({...values, [name]: value}));
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
        axios.post(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}/save`, inputs, config).then(function(response){
            console.log(response.data);

            // redirect to the plant page after creation to show the new plant id to the user
            navigate('/plant')
        })
        .catch(function(error){
            console.log('Plant creation failed: ',error)
        })
    }

    return(
        <div>
            <h1>Criar Planta</h1>
            <form onSubmit={handleSubmit}>
            <table align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Nome: </label>
                            </th>
                            <td>
                                <input class='roundedS' type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label >Local: </label>
                            </th>
                            <td>
                                <input id="location" class="roundedS" type="text" name="location" value={inputs.location} onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label>Tipo: </label>
                            </th>
                            <td>
                                <select class='roundedS' style={{width: '100%'}} name="type" onChange={handleChange}>
                                    <option value="">Seleciona um tipo</option>
                                    {types.map((type) => 
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <td colSpan="2" align="right">
                                <button class="buttonYes">Criar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
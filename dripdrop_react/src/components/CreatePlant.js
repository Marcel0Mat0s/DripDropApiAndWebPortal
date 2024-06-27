import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

export default function CreatePlant(){

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([])
    const [types, setTypes] = useState([])

    const userId = localStorage.getItem('userId');

    useEffect(() => {

        getTypes();

        // gets the location of the user
        navigator.geolocation.getCurrentPosition(function(position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
   
            // Set the location in the Location input
            document.getElementById('location').value = `${lat}, ${lon}`;
            setInputs(values => ({...values, location: `${lat}, ${lon}`}));
        });
    }, []);

    // Gets the plant types from the API
    function getTypes(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant types from the API
        axios.get(`http://localhost:80/PHP-API/types/null/${userId}`, config).then(function(response){
            console.log(response.data);
            setTypes(response.data);

        }).catch(function(error){
            console.log('Plant types retrieval failed: ',error)
        });

    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // checks if the user ID is available
        if (!userId) {
            console.error("No user ID available for request.");
            console.log("User ID: ", userId);
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


        axios.post(`http://localhost:80/PHP-API/plants/null/${userId}/save`, inputs, config).then(function(response){
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
                                <input id="location" class="roundedS" type="text" name="location"/>
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
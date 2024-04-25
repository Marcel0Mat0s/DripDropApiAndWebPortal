import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

export default function CreatePlant(){

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([])
    const [types, setTypes] = useState([])

    const userId = localStorage.getItem('userId');

    useEffect(() => {

        // gets the plant types from the API
        axios.get('http://localhost:80/PHP-API/types').then(function(response){
            console.log(response.data);
            setTypes(response.data);

        }).catch(function(error){
            console.log('Plant types retrieval failed: ',error)
        });

        // gets the location of the user
        navigator.geolocation.getCurrentPosition(function(position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
   
            // Set the location in the Location input
            document.getElementById('location').value = `${lat}, ${lon}`;
            setInputs(values => ({...values, location: `${lat}, ${lon}`}));
        });
    }, []);

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


        axios.post(`http://localhost:80/PHP-API/plants/${userId}/save`, inputs, config).then(function(response){
            console.log(response.data);
            // redirect to the plants page
            navigate('/plants')
        })
        .catch(function(error){
            console.log('Plant creation failed: ',error)
        })
    }

    return(
        <div>
            <h1>Create Plant</h1>
            <form onSubmit={handleSubmit}>
            <table cellSpacing="10" align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Name: </label>
                            </th>
                            <td>
                                <input type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label >Location: </label>
                            </th>
                            <td>
                                <input id="location" type="text" name="location"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label>Type: </label>
                            </th>
                            <td>
                                <select name="type" onChange={handleChange}>
                                    <option value="">Select a type</option>
                                    {types.map((type) => 
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="right">
                                <button>Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
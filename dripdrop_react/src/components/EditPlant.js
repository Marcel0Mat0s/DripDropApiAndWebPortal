import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPlant(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState([]);
    const [types, setTypes] = useState([]);

    // gets the id from the URL
    const {id} = useParams();

    // Gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        getTypes();
        getPlant();
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

    function getPlant(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get(`http://localhost:80/PHP-API/plants/${id}/${userId}`, config).then(function(response){
            console.log(response.data)
            setInputs(response.data)
        });
    }


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(inputs);

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Send a PUT request to the server
        axios.put(`http://localhost:80/PHP-API/plants/${userId}/${id}/edit`, inputs, config).then(function(response){
            console.log(response.data);
            navigate('/plants');
        })
        .catch(error => {
            console.log('Failed to update user: ', error);
            alert('Failed to update user');
        });
    }

    return(
        <div>  
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10" align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Name: </label>
                            </th>
                            <td>
                                <input value={inputs.name} type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label >Location: </label>
                            </th>
                            <td>
                                <input id="location" type="text" name="location" onChange={handleChange}/>
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
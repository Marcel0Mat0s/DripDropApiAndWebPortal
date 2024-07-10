import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState([]);

    // gets the id from the URL
    const {id} = useParams();

    // gets the user data from the API when the page loads
    useEffect(() => {
        getUser();
    }, []);

    /**
     * Function to get the user data from the API
     * 
     * @returns
     */
    function getUser(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the user data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}`, config).then(function(response){
            console.log(response.data);
            setInputs(response.data);
        });
    }

    /**
     * Function to handle the change on the inputs
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

        ////////////////////////////// Validations //////////////////////////////
        
        // cheks if all fields are filled
        if(!inputs.name || !inputs.email){
            alert('Por favor preencha todos os campos');
            return;
        }

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // sends the data to the API to update the user
        axios.put(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}/edit`, inputs, config).then(function(response){
            console.log(response.data);
            navigate('/main')
        })
        .catch(error => {
            console.log('Failed to update user: ', error);
            alert('Failed to update user');
        });
    }

    return(
        <div>  
            <h1>Definições</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10" align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Nome: </label>
                            </th>
                            <td>
                                <input class="roundedS" value={inputs.name} type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label>Email: </label>
                            </th>
                            <td>
                                <input class="roundedS" value={inputs.email} type="text" name="email" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2" align="right">
                                <button class="buttonYes">Guardar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
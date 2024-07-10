import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// View to edit a plant
export default function EditPlant(){

    // inicializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs and types states
    const [inputs, setInputs] = useState([]);
    const [types, setTypes] = useState([]);

    // gets the plant ID from the URL
    const {id} = useParams();

    // Gets the user ID from local storage
    const userId = localStorage.getItem('userId');

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
     * function to get the plant data from the API
     * 
     * @returns
     */
    function getPlant(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}`, config).then(function(response){
            console.log(response.data)
            setInputs(response.data)
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
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // Sends the data to the API to update the plant
        axios.put(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}/edit`, inputs, config).then(function(response){
            console.log(response.data);
            navigate('/plants');
        })
        .catch(error => {
            console.log('Failed to update user: ', error);
            alert('Erro ao atualizar a planta. Por favor tente novamente.');
        });
    }

    return(
        <div>  
            <h1>Editar Planta</h1>
            <form onSubmit={handleSubmit}>
                <table align="center">
                    <tbody width="100%">
                        <tr>
                            <th>
                                <label>Nome: </label>
                            </th>
                            <td >
                                <input class="roundedS" value={inputs.name} type="text" name="name" onChange={handleChange}/>
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
                                <select class="roundedS" style={{width: '100%'}} name="type" value={inputs.type} onChange={handleChange}>
                                    <option value="">Selecione um tipo</option>
                                    {types.map((type) => 
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <td colSpan="2" align="right">
                                <button class='buttonYes'>Guardar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
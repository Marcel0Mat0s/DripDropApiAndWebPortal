import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

// View to list all the plants of a user
export default function ListPlants(){

    // initializes the plants state
    const [plants, setPlants] = useState([]);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // gets the plants data from the API when the page loads
    useEffect(() => {
        getPlants();
    }, []);

    /**
     * Function to get the plants data from the API
     * 
     */
    function getPlants(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plants data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}`, config).then(function(response){
            console.log(response.data);
            setPlants(response.data);
        });
    }

    /**
     * Function to delete a plant
     * 
     * @param {*} id
     * @returns
     */
    const deletePlant = (id) => {

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // deletes the plant from the API
        axios.delete(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}/${id}/delete`, config).then(function(response){
            console.log(response.data)
            getPlants();
        });
    }

    /**
     * Function to navigate to a path
     * 
     * @param {*} path
     * @returns
     */
    const goTo = (path) => () => {
        window.location.href = path;
    }

    return(
        <div>
            <h1>Lista de Plantas</h1>
            <table align='center'>
                <tbody>
                    {plants.map((plant, key) =>
                        <tr key={key}>
                            <td class='tdSpace'>
                                <Link style={{color: '#D3D3D3'}} to={`/states/${plant.id}/${plant.type}/${plant.name}`} >{plant.name}</Link>
                            </td>
                            <td class='tdSpace'>
                                <Link class='buttonYes' to={`/plant/${plant.id}/edit`}>Editar</Link>
                            </td>
                            <td class='tdSpace'>
                                <button class='buttonNo' onClick={() => deletePlant(plant.id)}>Apagar</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br/>
            <button class='buttonBlue' onClick={goTo("/main")}>Voltar</button>
            <button class='buttonBlue' onClick={goTo("/plant/create")}>+</button>
        </div>
        
    )
}
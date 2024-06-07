import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function ListPlants(){

    const [plants, setPlants] = useState([]);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        getPlants();
    }, []);

    function getPlants(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get(`http://localhost:80/PHP-API/plants/null/${userId}`, config).then(function(response){
            console.log(response.data)
            setPlants(response.data)
        });
    }

    const deletePlant = (id) => {

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.delete(`http://localhost:80/PHP-API/plants/${id}/${userId}/${id}/delete`, config).then(function(response){
            console.log(response.data)
            getPlants();
        });
    }

    return(
        <div>
            <h1>Lista de Plantas</h1>
            <table align='center'>
                <tbody>
                    {plants.map((plant, key) =>
                        <tr key={key}>
                            <td id='tdSpace'>
                                <Link style={{color: '#D3D3D3'}} to={`/states/${plant.id}`}>{plant.name}</Link>
                            </td>
                            <td id='tdSpace'>
                                <Link id='buttonYes' to={`/plant/${plant.id}/edit`}>Editar</Link>
                            </td>
                            <td id='tdSpace'>
                                <button id='buttonNo' onClick={() => deletePlant(plant.id)}>Apagar</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br/>
            <Link id='buttonBlue' to="/plant/create">Nova Planta</Link>
        </div>
        
    )
}
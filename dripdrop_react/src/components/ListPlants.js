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
            <h1>List Plants</h1>
            <table align='center'>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {plants.map((plant, key) =>
                        <tr key={key}>
                            <td>
                                <Link to={`/states/${plant.id}`}>{plant.name}</Link>
                            </td>
                            <td>
                                <Link to={`/plant/${plant.id}/edit`} style={{marginRight: "10px"}}>Edit</Link>
                                <button onClick={() => deletePlant(plant.id)}>Delete</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link to="/plant/create">Create Plant</Link>
        </div>
        
    )
}
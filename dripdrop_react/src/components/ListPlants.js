import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function ListPlants(){

    const navigate = useNavigate();

    const [plants, setPlants] = useState([]);

    useEffect(() => {
        getPlants();
    }, []);

    function getPlants(){
        axios.get('http://localhost:80/PHP-API/plants/').then(function(response){
            console.log(response.data)
            setPlants(response.data)
        });
    }

    const deletePlant = (id) => {
        axios.delete(`http://localhost:80/PHP-API/plants/${id}/delete`).then(function(response){
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
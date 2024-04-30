import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";

export default function ListStates(){

    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();

    const [state, setState] = useState([]);

    const userId = localStorage.getItem('userId');

    console.log(plantId);

    useEffect(() => {
        // gets the plant state from the API every 20 seconds
        const interval = setInterval(() => {
            getState();
        }, 20000); // 20 seconds

        getState(); 

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [plantId]);

    function getState(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get( `http://localhost:80/PHP-API/states/${userId}/${plantId}`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        });
    }

    return(
        <div>
            <h1>Plant State</h1>
            <table align='center'>
                <thead>
                    <tr>
                        <th>Plant</th>
                        <th>Humidity Air</th>
                        <th>Temperature</th>
                        <th>Wind Direction</th>
                        <th>Wind Speed</th>
                        <th>Precipitation</th>
                        <th>Humidity Soil</th>
                        <th>NDVI</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {state.map((state, key) =>
                        <tr key={key}>
                            <td>{state.plant}</td>
                            <td>{state.humidity_air}</td>
                            <td>{state.temperature}</td>
                            <td>{state.wind_direction}</td>
                            <td>{state.wind_speed}</td>
                            <td>{state.precipitation}</td>
                            <td>{state.humidity_soil}</td>
                            <td>{state.ndvi}</td>
                            <td>{state.date}</td>
                            <td>{state.time}</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>  
    )
}
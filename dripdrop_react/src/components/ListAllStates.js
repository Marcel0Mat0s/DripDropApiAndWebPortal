import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";

export default function ListAllStates(){

    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();

    const [state, setState] = useState([]);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        
        getAllState();
        
    }, [plantId]);

    function getAllState(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get( `http://localhost:80/PHP-API/states/null/${userId}/${plantId}/all`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        });
    }

    // Function to decode the image from the database (base64) and display it
    function formatImageSrc(image){
        return `data:image/png;base64,${image}`;
    }

    return(
        <div>
            <h1>Plant State</h1>
            <button class='buttonYes' onClick={() => navigate('/plants')}>Continuar</button>
            <table align="center">
                <tbody>
                    <tr>
                        <td>
                            <table class="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <thead>
                                    <th>Planta</th>
                                    <th>Humidade do Ar</th>
                                    <th>Temperatura</th>
                                    <th>Direção do Vento</th>
                                    <th>Velocidade do Vento</th>
                                    <th>Precipitação</th>
                                    <th>Humidade do Solo</th>
                                    <th>NDVI</th>
                                    <th>Data</th>
                                    <th>Hora</th>
                                    <th>Imagem</th>
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
                                            <td><img src={formatImageSrc(state.image)} alt="Imagem do estado da planta" style={{width: '250px', height: '250px'}}/></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/>
        </div>
    )

}
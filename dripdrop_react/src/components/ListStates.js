import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";

export default function ListStates(){

    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();

    const [state, setState] = useState([]);

    const userId = localStorage.getItem('userId');

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

        axios.get( `http://localhost:80/PHP-API/states/null/${userId}/${plantId}/now`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        });
    }

    return(
        <div>
            <h1>Plant State</h1>
            <table align="center">
                <tbody>
                    <tr>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Planta
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.plant}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                        <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                            <th>
                                Humidade do Ar
                            </th>
                            <tbody>
                                {state.map((state, key) =>
                                    <tr key={key}>
                                        <td>{state.humidity_air}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Temperatura
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.temperature}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Direção do Vento
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.wind_direction}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Velocidade do Vento
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.wind_speed}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Precipitação
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.precipitation}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Humidade do Solo
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.humidity_soil}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    NDVI
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.ndvi}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Data
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.date}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table id="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <th>
                                    Hora
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.time}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>                            
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="right">
                            <button id="buttonBlue" onClick={() => navigate(`/states/all/${plantId}`)}>Ver tudo</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>  
    )
}
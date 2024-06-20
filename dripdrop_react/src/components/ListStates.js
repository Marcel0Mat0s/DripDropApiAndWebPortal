import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";

export default function ListStates(){

    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();
    const {plantType} = useParams();

    const [state, setState] = useState([]);

    const userId = localStorage.getItem('userId');
    //const [humiditySoil, setHumiditySoil] = useState(0);
    //const [NDVI, setNDVI] = useState(0);

    useEffect(() => {
        // gets the plant state from the API every 20 seconds
        const interval = setInterval(() => {
            getState();

            verifyState();

        }, 20000); // 20 seconds

        getState(); 

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [plantId]);

    // function to verify if the current humidity is below the plant type minimum humidity
    function verifyState(){

        // get the current humidity soil from the td element with the id humiditySoil
        const humiditySoil = document.getElementById('humiditySoil').innerHTML;
        const NDVI = document.getElementById('NDVI').innerHTML;

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant type minimum humidity from the API
        axios.get(`http://localhost:80/PHP-API/types/${plantType}/${userId}`, config).then(function(response){
            const minHumiditySoil = response.data.min_humidity;
            const maxHumiditySoil = response.data.max_humidity;
            const minNDVI = response.data.min_ndvi;

            // if the current humidity is below the plant type minimum humidity, sends an alert
            if(humiditySoil < minHumiditySoil){
                alert(`A humidade do solo está abaixo do recomendado para esta planta: ${minHumiditySoil} !`);
            } else if(humiditySoil > maxHumiditySoil){
                alert(`A humidade do solo está acima do recomendado para esta planta: ${maxHumiditySoil} !`);
            } 

            // if the current NDVI is below the plant type minimum NDVI, sends an alert
            if(NDVI < minNDVI){
                alert(`O NDVI está abaixo do recomendado para esta planta: ${minNDVI} !`);
            }
        });
    }

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

            //setHumiditySoil(state.humidity_soil);
            //setNDVI(state.ndvi);
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
                                            <td id="humiditySoil">{state.humidity_soil}</td>
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
                                            <td id="NDVI">{state.ndvi}</td>
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
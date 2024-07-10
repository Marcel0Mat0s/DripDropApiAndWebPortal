import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";

// View to list the state of a plant
export default function ListStates(){

    // initializes the navigate function
    const navigate = useNavigate();

    // gets the plant id, plant type and plant name from the URL
    const {plantId} = useParams();
    const {plantType} = useParams();
    const {plantName} = useParams();

    // initializes the state
    const [state, setState] = useState([]);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');
    
    // gets the plant state from the API when the page loads
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

    /**
     * Function to verify the state of the plant
     * 
     */
    function verifyState(){

        // get the current humidity soil from the td element with the id humiditySoil
        const humiditySoil = document.getElementById('humiditySoil').innerHTML;
        // get the current NDVI from the td element with the id NDVI
        const NDVI = document.getElementById('NDVI').innerHTML;

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant type minimum humidity from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/${plantType}/${userId}`, config).then(function(response){
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

    /**
     * Function to get the state of the plant from the API
     * 
     */
    function getState(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant state from the API
        axios.get( `https://dripdrop.danielgraca.com/PHP-API/states/null/${userId}/${plantId}/now`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        });
    }

    return(
        <div>
            <h1>Estado da {plantName}</h1>
            <table align="center">
                <tbody>
                    <tr>
                        <td>
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
                                    Rega
                                </th>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.irrigation}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                        <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                            <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                            <table class="whiteCard" align='center' style={{width: '110px', height: '80px'}}>
                                <th class="cardTitle">
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
                        <td colSpan="1" align="center">
                            <button class="buttonBlue" onClick={() => navigate(`/main`)}>Voltar</button>
                        </td>
                        <td colSpan="2" align="right">
                            <button class="buttonBlue" onClick={() => navigate(`/states/all/${plantId}`)}>Ver tudo</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>  
    )
}
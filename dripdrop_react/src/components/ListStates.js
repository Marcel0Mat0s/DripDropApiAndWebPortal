import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeToken, removeUserId } from "../redux/actions";

// View to list the state of a plant
export default function ListStates(){

    // initializes the navigate function
    const navigate = useNavigate();

    // gets the plant id, plant type and plant name from the URL
    const {plantId} = useParams();
    const {plantType} = useParams();
    const {plantName} = useParams();

    // saves the plant type in local storage
    localStorage.setItem('plantType', plantType);

    // initializes the state
    const [state, setState] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [maxHumiditySoil, setMaxHumiditySoil] = useState(0);
    const [minHumiditySoil, setMinHumiditySoil] = useState(0);
    const [minNDVI, setMinNDVI] = useState(0);
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [manMode, setManMode] = useState('automatico');
    const [rega, setRega] = useState('"OFF"');

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the plant state from the API when the page loads
    useEffect(() => {
        
        // gets the plant state from the API every 20 seconds
        const interval = setInterval(() => {
            getState();
            averageNDVI();
        }, 300000);

        getState(); 

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [plantId]);

    useEffect(() => {
        verifyState();
    }, [state]);

    useEffect(() => {
        const websocket = new WebSocket('wss://dripdrop.danielgraca.com/ws');
    
        websocket.onopen = () => {
            console.log('WebSocket connection established');

            // Sends the Plant ID to the server
            websocket.send(JSON.stringify({ action: 'subscribe', plantID: plantId }));
        };
    
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        websocket.onclose = (event) => {
            console.error('WebSocket closed:', event);
        };
    
        websocket.onmessage = (event) => {
            console.log('Received message:', event.data);
            try {
                const data = JSON.parse(event.data);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { topic: data.topic, message: data.message }
                ]);

                if (data.topic === `${plantId}/rega`) {
                    setRega(data.message);
                } else if (data.topic === `${plantId}/manMode`) {
                    setManMode(data.message);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
    
        setWs(websocket);
    
        return () => {
          websocket.close();
        };
    }, []);

    // Function to send a message to the MQTT broker
    const sendMessage = (newTopic, newPayload) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ action: 'publish', topic: newTopic, payload: newPayload });
            ws.send(message);
        }
    };

    /**
     * Function to calculate the average NDVI of the day
     * 
     */
    function averageNDVI(date) {
        // Check if the date is defined before proceeding
        if (!date) {
            console.error("Date is undefined");
            return 0; // Return 0 or some default value if date is undefined
        }
    
        // gets just the day from the date
        console.log(date);
        const day = date.split("-")[2];
        console.log(day);
    
        // initializes the sum and the count
        let sum = 0;
        let count = 0;
    
        // iterates through the states
        state.forEach((element) => {
            // gets the day from the date
            const dayState = element.date.split(" ")[0].split("-")[2];
    
            // if the day of the state is the same as the state displayed, adds the NDVI to the sum
            if(day === dayState){
                sum += element.ndvi;
                count++;
            }
        });

        // calcilates the average NDVI of the day with 2 decimal places
        sum = sum/count;
        sum = sum.toFixed(3);
    
        // returns the average NDVI
        return sum;
    }

    /**
     * Function to verify the state of the plant
     * 
     */
    function verifyState(){

        // if there are no states, returns
        if(state.length === 0){
            return;
        }

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
            const minNDVI = response.data.min_NDVI;

            setMinHumiditySoil(minHumiditySoil);
            setMaxHumiditySoil(maxHumiditySoil);
            setMinNDVI(minNDVI);

            // if the current humidity is below the plant type minimum humidity, sends an alert
            if( state[currentIndex].humidity_soil < minHumiditySoil){
                alert(`A humidade do solo está abaixo do recomendado para esta planta: ${minHumiditySoil} !`);
            } else if( state[currentIndex].humidity_soil > maxHumiditySoil){
                alert(`A humidade do solo está acima do recomendado para esta planta: ${maxHumiditySoil} !`);
            } 

            // if the current NDVI is below the plant type minimum NDVI, sends an alert
            if( state[currentIndex].ndvi < minNDVI){
                alert(`O NDVI está abaixo do recomendado para esta planta: ${minNDVI} !`);
            }
        }).catch(function(error){
            console.log(error);
            // ends the session if the token is invalid
            // Remove the token from the redux store and local storage
            dispatch(removeToken());
            localStorage.removeItem('token');

            // Remove the user id from the redux store and local storage
            dispatch(removeUserId());
            localStorage.removeItem('userId');
            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
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
        axios.get( `https://dripdrop.danielgraca.com/PHP-API/states/null/${userId}/${plantId}/all`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        }).catch(function(error){
            console.log(error);
            // ends the session if the token is invalid
            // Remove the token from the redux store and local storage
            dispatch(removeToken());
            localStorage.removeItem('token');

            // Remove the user id from the redux store and local storage
            dispatch(removeUserId());
            localStorage.removeItem('userId');
            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
        });
    }

    /**
     * Function to delete a plant
     * 
     * @param {*} ID
     * 
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
            // navigates to the plants list
            navigate(`/plants`);
        }).catch(function(error){
            console.log(error);
            alert("Erro ao apagar a planta. Por favor tente novamente.");
        });
    }

    /**
     * 
     * Function to format the image source to display it in the table
     * 
     * @param {*} image 
     * 
     */
    function formatImageSrc(image){
        return `data:image/png;base64,${image}`;
    }

    /**
     * Function to handle the manual mode switch
     * 
     */
    const handleManualSwitch = () => {
        const newMode = manMode === 'automatico' ? 'manual' : 'automatico';
        setManMode(newMode);
        sendMessage(`${plantId}/manMode`, newMode);
    }

    /**
     * Function to handle the irrigation switch
     * 
     */
    const handleIrrigationSwitch = () => {
        const newRega = rega === '"OFF"' ? '"ON"' : '"OFF"';
        setRega(newRega);
        sendMessage(`${plantId}/rega`, newRega);
    }

    // Function to navigate to the previous state
    function handlePrev() {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : state.length - 1));
    }

    // Function to handle navigation to the next state
    function handleNext() {
        setCurrentIndex((prevIndex) => (prevIndex < state.length - 1 ? prevIndex + 1 : 0));
    } 

    return (
        <div>
            <div class=" w-100 d-flex justify-content-between">
                <h1 style={{ textAlign: "left", paddingLeft: "12px" }}>{plantName}</h1>
            </div>
            <div class="container w-100 ">
                <div class="row w-100 d-flex justify-content-center">
                    {state.length > 0 && (
                        <>
                            <div class="col p-1" style={{alignContent: "center"}}>
                                <div class="h-100  d-flex justify-content-between" style={{ alignContent: "center"}}>
                                    <td style={{alignContent: "center"}}>
                                        <a class="blueBallCard fw-bold fs-4 text-center" onClick={handlePrev}>&#8249;</a>
                                    </td>
                                    <td style={{alignContent: "center"}}>
                                        <a class="blueBallCard fw-bold fs-4 text-center" onClick={handleNext}>&#8250;</a>
                                    </td>
                                </div>
                            </div>

                            <div class="col p-1">
                                <button class="btn btn-outline-info h-100 w-100" style={{borderRadius: "25px"}} onClick={() => navigate(`/states/all/${plantId}/${plantType}/${plantName}`)}>Gráficos</button>
                            </div>
                            <div class="col p-1">
                                <button class="w-100 btn btn-outline-danger h-100" style={{borderRadius:"25px"}} onClick={() => deletePlant(plantId)}>Apagar</button>
                            </div>
                            <div class="col p-1">
                                <button class="w-100 btn btn-outline-success h-100" style={{borderRadius:"25px"}} onClick={() => navigate(`/plant/${plantId}/edit`)}>Editar</button>
                            </div>

                            <div class="w-100"></div>

                            <div class="col p-1" style={{alignContent: "center"}}>
                                <div class="whiteCard h-100 " style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Temperatura</h3>
                                        <hr class=" w-100 hr hr-blurry" />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].temperature}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Humidade do Ar</h3>
                                        <hr class=" w-100 hr hr-blurry " />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].humidity_air}</h3>
                                    </div>
                                </div>    
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Velocidade do Vento</h3>
                                        <hr class="h-100 hr hr-blurry"></hr>
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].wind_speed}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Direção do Vento</h3>
                                        <hr class=" w-100 hr hr-blurry " />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].wind_direction}</h3>
                                    </div>
                                </div>
                            </div>

                            <div class="w-100"></div>

                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Precipitação</h3>
                                        <hr class=" w-100 hr hr-blurry" />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].precipitation}</h3>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col p-1" style={{ alignContent: "center"}}>
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="my-0 fs-4">NDVI</h3>
                                        <hr class=" w-100 hr hr-blurry " />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="NDVI">{state[currentIndex].ndvi}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1" style={{ alignContent: "center"}}>
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="my-0 fs-4">NDVI Diário</h3>
                                        <hr class=" w-100 hr hr-blurry" />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="NDVI">{averageNDVI(state[currentIndex].date)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1" style={{ alignContent: "center"}}>
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="my-0 fs-4">NDVI Mínimo</h3>
                                        <hr class=" w-100 hr hr-blurry" />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="NDVI">{minNDVI}</h3>
                                    </div>
                                </div>
                            </div>

                            <div class="w-100"></div>

                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Humidade Mínima</h3>
                                        <hr class=" w-100 hr hr-blurry " />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="humiditySoil">{minHumiditySoil}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Humidade do Solo</h3>
                                        <hr class=" w-100 hr hr-blurry " />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="humiditySoil">{state[currentIndex].humidity_soil}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="fs-4">Humidade Máxima</h3>
                                        <hr class=" w-100 hr hr-blurry "/>
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3 id="humiditySoil"> {maxHumiditySoil}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="h-50" style={{ alignContent: "center"}}>
                                        <h3 class="mx-5 my-0 fs-4">Data e Hora</h3>
                                        <hr class="w-100 hr hr-blurry" />
                                    </div>
                                    <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                        <h3>{state[currentIndex].date} às {state[currentIndex].time}</h3>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="w-100"></div>

                            <div class="col-8 p-1">
                                <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <img src={formatImageSrc(state[currentIndex].image)} alt="Imagem" class="w-100" style={{borderRadius:"15px"}}/>
                                </div>
                            </div>
                            <div class="col p-0" style={{ alignContent: "center"}}>

                                <div class="h-50 p-1" style={{ alignContent: "center"}}>
                                    <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                    <div class="row d-flex justify-content-between">
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <h2 class="fs-4">Rega</h2>
                                        </td>
                                        <td class="w-auto">
                                            <vr class="h-100 vr vr-blurry"></vr>
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <h2 id="regaLabel" class="fs-4">{rega}</h2>
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <label class="switch">
                                                <input type="checkbox" 
                                                // if the current index is not 0 or the manMode is automatico, the switch is disabled
                                                disabled={currentIndex !== 0 || manMode === "automatico"}
                                                // if regaLabel is ON, the switch is checked
                                                checked={rega === '"ON"'}
                                                onClick={handleIrrigationSwitch}
                                                />
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </div>
                                    </div>
                                </div>
                                <div class="h-50 p-1" style={{ alignContent: "center"}}>
                                    <div class="whiteCard h-100" style={{ alignContent: "center"}}>
                                        <div class="row d-flex justify-content-between">
                                            <td class="w-auto" style={{ alignContent: "center"}}>
                                                <h2 class="fs-4">Modo</h2>
                                            </td>
                                            <td class="w-auto">
                                                <vr class="h-100 vr vr-blurry"></vr>
                                            </td>
                                            <td class="w-auto" style={{ alignContent: "center"}}>
                                                <h2 id="manModeLabel" class="fs-4">{manMode}</h2>
                                            </td>
                                            <td class="w-auto" style={{ alignContent: "center"}}>
                                                <label class="switch">
                                                    <input id="manModeSwitch" type="checkbox" 
                                                    disabled={currentIndex !== 0} 
                                                    checked={manMode === "automatico"}
                                                    onClick={handleManualSwitch}
                                                    />
                                                    <span class="slider round"></span>
                                                </label>
                                            </td>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>  
    );
}
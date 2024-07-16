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

    // initializes the state
    const [state, setState] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();
    
    // gets the plant state from the API when the page loads
    useEffect(() => {
        
        // gets the plant state from the API every 20 seconds
        const interval = setInterval(() => {
            getState();
            verifyState();
        }, 60000); // 60 seconds

        getState(); 

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [plantId]);

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
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/${plantType}/${userId}/all`, config).then(function(response){
            const minHumiditySoil = response.data.min_humidity;
            const maxHumiditySoil = response.data.max_humidity;
            const minNDVI = response.data.min_ndvi;

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
            <br/>
            <div class="container w-100">
                <div class="row w-100">
                    {state.length > 0 && (
                        <>
                            <div class="col-auto whiteCard m-2" style={{alignContent: "center"}}>
                                <div class="row h-100 d-flex justify-content-between">
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3 class="fs-4">Temperatura</h3>
                                    </td>
                                    <td class="w-auto">
                                        <vr class="h-100 vr vr-blurry"></vr>
                                    </td>
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3>{state[currentIndex].temperature}</h3>
                                    </td>
                                </div>
                            </div>
                            <div class="col-auto whiteCard m-2">
                                <div class="h-50" style={{ alignContent: "center"}}>
                                    <h3 class="fs-4">Humidade do Ar</h3>
                                    <hr class=" w-100 hr hr-blurry my-1" />
                                </div>
                                <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                    <h3>{state[currentIndex].humidity_air}</h3>
                                </div>    
                            </div>
                            <div class="col-auto whiteCard m-2">
                                <div class="h-50" style={{ alignContent: "center"}}>
                                    <h3 class="fs-4">Direção do Vento</h3>
                                    <hr class=" w-100 hr hr-blurry my-1" />
                                </div>
                                <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                    <h3>{state[currentIndex].wind_direction}</h3>
                                </div>
                            </div>
                            <div class="col-auto whiteCard m-2">
                                <div class="h-50" style={{ alignContent: "center"}}>
                                    <h3 class="mx-5 my-0 fs-4">Data e Hora</h3>
                                    <hr class=" w-100 hr hr-blurry my-1" />
                                </div>
                                <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                    <h3>{state[currentIndex].date} ás {state[currentIndex].time}</h3>
                                </div>
                            </div>
                            
                            <div class="col p-0 m-2" style={{ alignContent: "center"}}>
                                <div style={{ alignContent: "center",}}>
                                    <button class=" btn btn-outline-info" style={{borderRadius:"50%", width: "15vh", height: "15vh" }} onClick={() => navigate(`/states/all/${plantId}`)}>Gráficos</button>
                                </div>
                            </div>
                            

                            <div class="w-100"></div>

                            <div class="col-auto whiteCard m-2" style={{ alignContent: "center"}}>
                                <div class="h-50" style={{ alignContent: "center"}}>
                                    <h3 class="mx-5 my-0 fs-4">NDVI</h3>
                                    <hr class=" w-100 hr hr-blurry my-1" />
                                </div>
                                <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                    <h3 id="NDVI">{state[currentIndex].ndvi}</h3>
                                </div>
                            </div>

                            <div class="col-auto whiteCard m-2">
                                <div class="row h-100 d-flex justify-content-between">
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3 class="fs-4">Velocidade do Vento</h3>
                                    </td>
                                    <td class="w-auto">
                                        <vr class="h-100 vr vr-blurry"></vr>
                                    </td>
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3>{state[currentIndex].wind_speed}</h3>
                                    </td>
                                </div>
                            </div>
                            <div class="col-auto whiteCard m-2">
                                <div class="row h-100 d-flex justify-content-between">
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3 class="fs-4">Precipitação</h3>
                                    </td>
                                    <td class="w-auto">
                                        <vr class="h-100 vr vr-blurry"></vr>
                                    </td>
                                    <td class="w-auto" style={{alignContent: "center"}}>
                                        <h3>{state[currentIndex].precipitation}</h3>
                                    </td>
                                </div>
                            </div>
                            <div class="col whiteCard m-2">
                                <div class="h-50" style={{ alignContent: "center"}}>
                                    <h3 class="fs-4">Humidade do Solo</h3>
                                    <hr class=" w-100 hr hr-blurry my-1" />
                                </div>
                                <div class="h-50 py-3" style={{ alignContent: "center"}}>
                                    <h3 id="humiditySoil">{state[currentIndex].humidity_soil}</h3>
                                </div>
                            </div>

                            <div class="w-100"></div>

                            <div class="col-6 whiteCard m-2">
                                <img src={formatImageSrc(state[currentIndex].image)} alt="Imagem" class="w-100" style={{borderRadius:"15px"}}/>
                            </div>
                            <div class="col-auto m-2" style={{ alignContent: "center"}}>
                                <div class="h-50">
                                    <div class="row whiteCard d-flex justify-content-between">
                                        <td class="w-auto" style={{ alignContent: "center", padding: "12% 5px 12% 5px"}}>
                                            <h2 class="fs-4">Rega</h2>
                                        </td>
                                        <td class="w-auto">
                                            <vr class="h-100 vr vr-blurry"></vr>
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <h2>{state[currentIndex].irrigation}</h2>
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <label class="switch">
                                                <input type="checkbox" 
                                                disabled={currentIndex !== 0}
                                                checked={state[currentIndex].irrigation === "ON"}
                                                />
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </div>
                                </div>
                                <div class="h-50">
                                    <div class="row whiteCard d-flex justify-content-between">
                                        <td class="w-auto" style={{ alignContent: "center", padding: "12% 0px 12% 0px"}}>
                                            <h2 class="fs-4">Modo</h2>
                                        </td>
                                        <td class="w-auto">
                                            <vr class="h-100 vr vr-blurry"></vr>
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <h2>Automatico</h2>
                                            
                                        </td>
                                        <td class="w-auto" style={{ alignContent: "center"}}>
                                            <label class="switch">
                                                <input type="checkbox" disabled={currentIndex !== 0} checked={true}/>
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div class="col m-2">
                        <div class="h-50">
                            <div class="w-100 h-auto whiteCard" style={{ alignContent: "center", padding: "12% 5px 12% 5px"}}>
                                <button class="w-100 btn btn-outline-danger my-2" onClick={() => deletePlant(plantId)}>Apagar</button>
                                <button class="w-100 btn btn-outline-success my-1" onClick={() => navigate(`/plant/${plantId}/edit`)}>Editar</button>
                            </div>
                        </div>
                        <div class="h-50">
                            <div class="w-100 d-flex justify-content-around" style={{ padding: "0px 5px 0px 5px"}}>
                                <a class="blueBallCard fw-bold fs-4 text-center" onClick={handlePrev}>&#8249;</a>
                                <a class="blueBallCard fw-bold fs-4 text-center" onClick={handleNext}>&#8250;</a>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>  
    );
}
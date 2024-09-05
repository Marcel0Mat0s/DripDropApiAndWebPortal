import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken, removeUserId, removeRole } from "../redux/actions";
import logo from '../images/dripdropdigital.png';

// View to claim a new device
export default function CreateDevice() {

    // initializes the device state with the plant id null
    const [device, setDevice] = useState({fk_plant: null});

    // initializes the plants from the user state
    const [plants, setPlants] = useState([]);

    // gets the navigate function from the router
    const navigate = useNavigate();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the user id from the redux store
    const userId = useSelector((state) => state.auth.userId);

    // gets the plants data from the API when the page loads
    useEffect(() => {
        // Add the user id to the device object
        setDevice({...device, fk_user: userId});

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // gets the types data from the API
        axios
            .get(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}`, config)
            .then(function (response) {
                console.log(response.data);
                setPlants(response.data);
            }).catch(function(error){
                console.log(error);
                // ends the session if the token is invalid
                // Remove the token from the redux store and local storage
                dispatch(removeToken());
                localStorage.removeItem('token');

                // Remove the user id from the redux store and local storage
                dispatch(removeUserId());
                localStorage.removeItem('userId');

                // Remove the role from the redux store and local storage
                dispatch(removeRole());
                localStorage.removeItem('role');
                
                // navigates to the login page if the user is not authenticated
                navigate('/login');
                alert("Sessão expirada. Por favor faça login novamente.");
            });
    }, []);

    /**
     * Function to handle the change on the inputs
     * 
     * @param {object} event 
     * 
     */
    function handleChange(event){
        const {name, value} = event.target;
        setDevice({...device, [name]: value});
    }

    /**
     * Function to handle the submit event
     * 
     * @param {object} event
     * 
     * */
    function handleSubmit(event){
        event.preventDefault();

        console.log(device);
        //////////////// VALIDATION ////////////////
        // checks if the every field is filled
        if (!device.id ) {
            alert("O campo Endereço MAC é obrigatório.");
            return;
        }

        // checks if the device has a user 
        if (!device.fk_user) {
            alert("Erro ao adicionar o dispositivo. Por favor tente novamente.");
            return;
        }

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // updates the device data to the API
        axios
            .put(`https://dripdrop.danielgraca.com/PHP-API/devices/${device.id}/${userId}`, device, config)
            .then(function (response) {
                console.log(response.data);
                alert("Dispositivo adicionado com sucesso.");
                navigate('/devices');
            }).catch(function(error){
                console.log(error);
                alert("Erro ao adicionar o dispositivo. Por favor tente novamente.");
            });


    }

    return (
        <div className="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div class="whiteFullCard d-flex items-align-center">
                <div align="center" style={{width: '100%'}}>
                    <form onSubmit={handleSubmit}>
                        <table class="text-light w-75" cellSpacing="20" align="center" style={{margin: '50px'}}>
                            <thead>
                                <tr>
                                    <h2 class="text-dark" align="left">Adicione o seu Dispositivo:</h2>
                                    <br/>
                                </tr>
                            </thead>
                            <tbody>
                                <div class="form-floating mb-3">
                                    <input id="floatingNome" class="form-control" type="id" name="id" onChange={handleChange} placeholder="id"/>
                                    <label for="floatingNome" >Endereço MAC </label>
                                </div>

                                <div class="form-floating mb-3">
                                    <select id="floatingType" class="form-select p-3" aria-label="Floating label select example" name="fk_plant" onChange={handleChange}>
                                        <option value="">Selecione uma plantação</option>
                                        {plants.map((plant) => 
                                            <option key={plant.id} value={plant.id}>{plant.name}</option>
                                        )}
                                    </select>
                                </div>

                                <div colSpan="2" align="right">
                                    <button class="btn btn-outline-success">Guardar</button>
                                </div>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId, removeRole } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';


// View to show the details of a device
export default function DetailsDevice(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState({});

    // gets the user ID from the redux store
    const userId = localStorage.getItem('userId');

    // gets the id from the URL
    const {id} = useParams();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    // gets the user data from the API when the page loads
    useEffect(() => {
        getDevice();
    }, []);

    /**
     * Function to get the device data from the API
     * 
     **/
    function getDevice(){
        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        // gets the device data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/devices/${id}`, config).then(function(response){
            console.log(response.data);
            setInputs(response.data);
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
    }

    /**
     * Function to delete the device
     * 
     * @param {int} id
     *  
     * */
    function deleteDevice(id){
        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // deletes the device from the API
        axios.delete(`https://dripdrop.danielgraca.com/PHP-API/devices/${id}`, config).then(function(response){
            console.log(response.data);
            navigate('/devices');
            alert('Dispositivo apagado com sucesso');
        }).catch(function(error){
            console.log(error);
            alert('Erro ao apagar o dispositivo, por favor tente novamente');
        });
    }

    
    return(
        <div className="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div class="whiteFullCard d-flex items-align-center">
                <div align="center" style={{width: '100%'}}>
                        <table class="text-light w-75" cellSpacing="20" align="center" style={{margin: '50px'}}>
                            <thead>
                                <tr>
                                    <h2 class="text-dark" align="left">📝Detalhes:</h2>
                                    <br/>
                                </tr>
                            </thead>
                            <tbody>
                                    <div class="form-floating mb-3">
                                        <input id="floatingNome" class="form-control" value={inputs.id} type="name" name="name" placeholder="nome" disabled/>
                                        <label for="floatingNome" >Endereço MAC: </label>
                                    </div>

                                    {role === 'admin' ?
                                    <div class="form-floating mb-3">
                                        <input id="floatingClient" class="form-control" value={inputs.fk_user} type="number" step=".5" name="max_humidity" placeholder="Hmax" disabled/>
                                        <label for="floatingClient" >Cliente </label>
                                    </div>
                                    : null}
                                    
                                    <div class="form-floating mb-3">
                                        <input id="floatingPlant" class="form-control" value={inputs.fk_plant} type="number" step=".5" name="min_humidity" placeholder="Hmin" disabled/> 
                                        <label for="floatingPlant" >Planta </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingClient" class="form-control"  type="text" step=".5" name="max_humidity" placeholder="Hmax" disabled/>
                                        <label for="floatingClient" >Estado </label>
                                    </div>

                                    <div colSpan="2" align="right">
                                        <a class="btn btn-outline-info" href={`/device/${id}/edit`}>Editar</a>
                                        <button class="btn btn-outline-danger mx-1" onClick={() => deleteDevice(id)}>Apagar</button>
                                    </div>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    ); 
}
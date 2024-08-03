import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';



export default function DetailsType(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState([]);

    // gets the user ID from the redux store
    const userId = localStorage.getItem('userId');

    // gets the id from the URL
    const {id} = useParams();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    // gets the user data from the API when the page loads
    useEffect(() => {
        getType();
    }, []);

    /**
     * Function to get the type data from the API
     * 
     **/
    function getType(){
        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        // gets the type data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/${id}`, config).then(function(response){
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
            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert('Sessão expirada. Por favor faça login novamente.');
        });
    }

    /**
     * Function to delete a type
     * 
     * @param {*} id
     * */
    function deleteType(id){
        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // deletes the type from the API
        axios.delete(`https://dripdrop.danielgraca.com/PHP-API/types/${id}/${userId}`, config).then(function(response){
            console.log(response.data);
            navigate('/types');
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
            alert('Sessão expirada. Por favor faça login novamente.');
        }
        );
    }


    return(
        <div class="container">  
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
                                        <input id="floatingNome" class="form-control" value={inputs.name} type="name" name="name" placeholder="nome" disabled/>
                                        <label for="floatingNome" >Nome: </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingHmax" class="form-control" value={inputs.max_humidity} type="number" step=".5" name="max_humidity" placeholder="Hmax" disabled/>
                                        <label for="floatingHmax" >Humidade Máxima </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingHmin" class="form-control" value={inputs.min_humidity} type="number" step=".5" name="min_humidity" placeholder="Hmin" disabled/> 
                                        <label for="floatingHmin" >Humidade Mínima </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingNDVImin" class="form-control" value={inputs.min_NDVI} type="number" step=".01" name="min_NDVI" placeholder="NDVImin" disabled/>
                                        <label for="floatingNDVImin" >NDVI Mínimo </label>
                                    </div>


                                    <div colSpan="2" align="right">
                                        <a class="btn btn-outline-info" href={`/type/${id}/edit`}>Editar</a>
                                        <button class="btn btn-outline-danger mx-1" onClick={() => deleteType(id)}>Apagar</button>
                                    </div>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    )
}
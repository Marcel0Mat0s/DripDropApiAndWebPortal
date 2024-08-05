import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId, removeRole } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';



export default function DetailsUser(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState([]);

    // gets the id from the URL
    const {id} = useParams();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the user data from the API when the page loads
    useEffect(() => {
        getUser();
    }, []);

    /**
     * Function to get the user data from the API
     * 
     */
    function getUser(){

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the user data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}///${role}`, config).then(function(response){
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

            // Remove the role from the redux store and local storage
            dispatch(removeRole());
            localStorage.removeItem('role');

            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
        });
    }

    /**
   * Function to delete a user
   * 
   * @param {number} id
   * @returns
   */
    function deleteUser(id) {
        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // deletes the user from the API
        axios
        .delete(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}///${role}`, config)
        .then(function (response) {
            console.log(response.data);
            navigate('/users'); 
            alert("Cliente apagado com sucesso.");
        })
        .catch(function (error) {
            console.log(error);
            alert("Erro ao apagar o Cliente.");
        });
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
                                    <h2 class="text-dark" align="left">🪪Detalhes:</h2>
                                    <br/>
                                </tr>
                            </thead>
                            <tbody>
                                    <div class="form-floating mb-3">
                                        <input id="floatingNome" class="form-control" value={inputs.name} type="name" name="name" placeholder="nome" disabled/>
                                        <label for="floatingNome" >Nome: </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingEmail" class="form-control" value={inputs.email} type="email" name="email" placeholder="nome@exemplo.com" disabled/> 
                                        <label for="floatingEmail" >Email: </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingRole" class="form-control" value={inputs.role} type="role" name="role" placeholder="role" disabled/>
                                        <label for="floatingRole" >Role: </label>
                                    </div>

                                    <div colSpan="2" align="right">
                                        <a class="btn btn-outline-info floating" align="left" href={`/user/${id}/plants`}>Plantas</a>
                                        <a class="btn btn-outline-info mx-1" href={`/user/${id}/edit`}>Editar</a>
                                        <button class="btn btn-outline-danger" onClick={() => deleteUser(id)}>Apagar</button>
                                    </div>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    )
}
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId } from '../redux/actions';
import { useDispatch } from 'react-redux';


export default function EditUser(){

    // gets the navigate function from the router
    const navigate = useNavigate();

    // sets the inputs to an empty array
    const [inputs, setInputs] = useState([]);

    // gets the id from the URL
    const {id} = useParams();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

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
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the user data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}`, config).then(function(response){
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
        });
    }

    /**
     * Function to handle the change on the inputs
     * 
     * @param {*} event
     * @returns
     */
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    /**
     * Function to handle the submit of the form
     * 
     * @param {*} event
     * @returns
     */
    const handleSubmit = (event) => {

        // prevents the default behavior of the form
        event.preventDefault();

        ////////////////////////////// Validations //////////////////////////////
        
        // cheks if all fields are filled
        if(!inputs.name || !inputs.email){
            alert('Por favor preencha todos os campos');
            return;
        }

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // sends the data to the API to update the user
        axios.put(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}/edit`, inputs, config).then(function(response){
            console.log(response.data);
            navigate('/main')
        })
        .catch(error => {
            console.log('Failed to update user: ', error);
            alert('Failed to update user');
        });
    }

    return(
        <div>  
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div class="whiteFullCard d-flex items-align-center">
                <div align="center" style={{width: '100%'}}>
                    <form onSubmit={handleSubmit}>
                        <table class="text-light w-75" cellSpacing="20" align="center" style={{margin: '50px'}}>
                            <thead>
                                <tr>
                                    <h2 class="text-dark" align="left">⚙️Definições:</h2>
                                    <br/>
                                </tr>
                            </thead>
                            <tbody>
                                    <div class="form-floating mb-3">
                                        <input id="floatingNome" class="form-control" value={inputs.name} type="name" name="name" onChange={handleChange} placeholder="nome"/>
                                        <label for="floatingNome" >Nome: </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingEmail" class="form-control" value={inputs.email} type="email" name="email" onChange={handleChange} placeholder="nome@exemplo.com" /> 
                                        <label for="floatingEmail" >Email: </label>
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
    )
}
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId, removeRole } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';



export default function EditUser(){

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

            // Remove the role from the redux store and local storage
            dispatch(removeRole());
            localStorage.removeItem('role');

            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
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

        // If the user is an admin, checks if the role and password are filled
        if(role === 'admin'){
            if(!inputs.role){
                alert('Por favor preencha todos os campos');
                return;
            }

            // checks if the password has at least 8 characters
            if(inputs.password.length < 8){
                alert('A palavra-passe tem de ter pelo menos 8 caracteres');
                return;
            }

            // checks if the role is either user or admin
            if(inputs.role !== 'user' && inputs.role !== 'admin'){
                alert('O role tem de ser user ou admin');
                return;
            }

            // hashes the password
            const bcrypt = require('bcryptjs');
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(inputs.password, salt);
            inputs.password = hash;
        }

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // sends the data to the API to update the user
        axios.put(`https://dripdrop.danielgraca.com/PHP-API/users/${id}/${id}/edit//${role}`, inputs, config).then(function(response){
            console.log(response.data);
            navigate('/plants')
        }).catch(function(error){
            console.log(error);
            alert("Erro ao atualizar o Cliente, tenta novamente.");
        });
    }

    /**
     * Function to show the password
     */
    function myFunction() {
        try {
            var x = document.getElementById("floatingPassword");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    return(
        <div class="container">  
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


                                    {role === 'admin' ? 
                                        <>
                                        <div class="form-floating mb-3">
                                            <input id="floatingRole" class="form-control" value={inputs.role} type="role" name="role" onChange={handleChange} placeholder="role"/>
                                            <label for="floatingRole" >Cargo: </label>
                                        </div>
                                        </>
                                        : null
                                    }

                                    <div class="form-floating mb-3">
                                        <input id="floatingPassword" class="form-control" type="password" name="password" onChange={handleChange} placeholder="password"/>
                                        <label for="floatingPassword" >Palavra-passe: </label>
                                        <div className="form-check d-flex justify-content-start" >
                                            <input className="form-check-input" type="checkbox" onClick={myFunction}/>
                                            <label className="text-dark fw-bold">Mostrar Palavra-passe</label>
                                        </div>
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
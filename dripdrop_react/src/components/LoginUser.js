import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, removeToken, setUserId, removeUserId, setRole, removeRole } from '../redux/actions';

// View to login a user
export default function LoginUser() {

    // initializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs state
    const [inputs, setInputs] = useState([])

    /**
     * Function to handle the change on the inputs
     *
     * @param {*} event 
     */
    const handleChange = (event) => {

        // gets the name and value of the input
        const name = event.target.name;
        const value = event.target.value;

        // sets the new value in the inputs state
        setInputs(values => ({ ...values, [name]: value }));
    }

    /**
     * Function to handle the submit of the form
     * 
     * @param {*} event 
     */
    const handleSubmit = (event) => {

        // prevents the default behavior of the form
        event.preventDefault();

        // calls the login function
        login(inputs.email, inputs.password);
    }

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    /**
     * Function to login the user
     * 
     * @param {*} email 
     * @param {*} password 
     */
    const login = async (email, password) => {
        try {

            // Send a POST request to the server
            const response = await axios.post('https://dripdrop.danielgraca.com/PHP-API/login', { email, password });

            // Get the token and user id and role from the response
            const token = response.data.token;
            const userId = response.data.userId;
            const role = response.data.role;

            // Set the token in the redux store and local storage
            dispatch(setToken(token));
            localStorage.setItem('token', token);

            // Set the user id in the redux store and local storage
            dispatch(setUserId(userId));
            localStorage.setItem('userId', userId);

            // Set the role in the redux store and local storage
            dispatch(setRole(role));
            localStorage.setItem('role', role);

            console.log('Authentication successful: ', response.data);
            console.log(token);

            // Redirect to the main page
            navigate('/plants');

        } catch (error) {
            console.log('Authentication failed: ', error);
            alert("Email ou palavra-passe incorretos");
        }
    }

    /**
     * Function to navigate to a path
     * 
     * @param {*} path 
     * @returns 
     */
    const navigateTo = (path) => {
        return function () {
            navigate(path);
        }
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

    return (
        <div className="d-flex items-align-center">
            <div className="row p-0 w-100">

                <div className="col m-5 whiteFullCard">

                    <div className="h-25">
                        <h1 align="center">Entre na sua conta DripDrop!</h1>
                        <br />

                        <hr className="hr hr-blurry" />
                        <br />
                    </div>

                    <form className="h-75" onSubmit={handleSubmit}>
                        <br />
                        <table align="center" className="text-light w-75">
                            <thead>
                                <tr>
                                    <td className="text-dark">
                                        <h2 align="left">Inicie Sessão:</h2>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="form-floating mb-3">
                                            <input id="floatingEmail" className="form-control" type="email" name="email" placeholder="name@example.com" onChange={handleChange} />
                                            <label htmlFor="floatingEmail">Email</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-floating mb-3">
                                            <input id="floatingPassword" className="form-control" type="password" name="password" placeholder="Password" onChange={handleChange} />
                                            <label htmlFor="floatingPassword">Palavra-passe</label>
                                            <div className="form-check d-flex justify-content-start" >
                                                <input className="form-check-input" type="checkbox" onClick={myFunction}/>
                                                <label className="text-dark fw-bold">Mostrar Palavra-passe</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="d-flex bd-highlight">
                                        <a align="left" className=" bd-highlight" href="/user/forgot">Esqueceu-se da palavra-passe?</a>
                                        <button align="right" className="btn btn-outline-success ms-auto bd-highlight">Iniciar Sessão</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="col m-5 whiteFullCard">
                    <div className="h-25">
                        <h1 align="center">Ainda não tem conta? 😢</h1>
                        <br />
                        <hr className="hr hr-blurry" />
                        <br />
                    </div>
                    <div className="h-75">
                        <br />
                        <table align="center" className="w-75">
                            <tbody>
                                <tr>
                                    <td>
                                        <h2 align="left">Registe-se já!</h2>
                                        <br />
                                        <p align='left'>Crie a sua conta DripDrop e comece já a monitorizar as suas plantas!</p>
                                        <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <button className="btn btn-outline-success" align="end" onClick={navigateTo("/user/create")}>Criar Conta</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

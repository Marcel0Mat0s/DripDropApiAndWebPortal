import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, removeToken, setUserId, removeUserId } from './../redux/actions';

// View to login a user
export default function LoginUser(){

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
        setInputs(values => ({...values, [name]: value}));
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
    const login = async(email, password) => {
        try {

            // Send a POST request to the server
            const response = await axios.post('https://dripdrop.danielgraca.com/PHP-API/login', {email, password});

            // Get the token and user id from the response
            const token = response.data.token;
            const userId = response.data.userId;

            // Set the token in the redux store and local storage
            dispatch(setToken(token));
            localStorage.setItem('token', token);

            // Set the user id in the redux store and local storage
            dispatch(setUserId(userId));
            localStorage.setItem('userId', userId);

            console.log(token);

            // Redirect to the main page
            navigate('/main');
            
        } catch (error) {
            console.log('Authentication failed: ', error);
            alert("Email ou palavra-passe incorretos");
        }
    }
  
    /**
     * Function to logout the user
     * 
     */
    const logout = () => {

        // Remove the token from the redux store and local storage
        dispatch(removeToken());
        localStorage.removeItem('token');

        // Remove the user id from the redux store and local storage
        dispatch(removeUserId());
        localStorage.removeItem('userId');

        // Redirect to the principal page
        navigate('/');

        console.log('Logged out');
    }

    /**
     * Function to navigate to a path
     * 
     * @param {*} path 
     * @returns 
     */
    const navigateTo = (path) => {
        return function(){
            navigate(path);
        } 
    }

    return(
        <div>  
            <div className="whiteFullCard">
                <form onSubmit={handleSubmit}>

                    <table align="center">

                        <tbody>
                            <tr>
                                <th>
                                    <label>Email: </label>
                                </th>
                                <td>
                                    <input class="roundedS" type="email" name="email" onChange={handleChange}/>
                                </td>
                            </tr>

                            <tr>
                                <th>
                                    <label>Palavra-passe: </label>
                                </th>
                                <td>
                                    <input class="roundedS" type="password" name="password" onChange={handleChange}/>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="2" align="right">
                                    <button class="buttonYes">Iniciar Sessão</button>
                                    <button class="buttonYes" style={{marginLeft: '5px'}} onClick={navigateTo("/user/create")}>Criar Conta</button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" align="right">
                                    <button style={{marginLeft: '5px'}} class="buttonNo" onClick={logout}>Logout</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>  
        </div>
    )
}
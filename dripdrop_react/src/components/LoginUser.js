import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, removeToken, setUserId, removeUserId } from './../redux/actions';

export default function LoginUser(){

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        // calls the login function
        login(inputs.email, inputs.password);
    }

    const dispatch = useDispatch();

    // Login function to authenticate user
    const login = async(email, password) => {
        try {

            // Send a POST request to the server
            const response = await axios.post('http://193.137.5.80:80/PHP-API/login', {email, password});
            // Get the token from the response
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
        }
    }
  
    // Logout function
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

    const navigateTo = (path) => {
        return function(){
            navigate(path);
        } 
    }

    return(
        <div>  
            <h1>Iniciar Sessão</h1>
            <form onSubmit={handleSubmit}>

                <table align="center">

                    <tbody>
                        <tr>
                            <th>
                                <label>Email: </label>
                            </th>
                            <td>
                                <input class="roundedS" type="text" name="email" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label>Palavra-passe: </label>
                            </th>
                            <td>
                                <input class="roundedS" type="text" name="password" onChange={handleChange}/>
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
    )
}
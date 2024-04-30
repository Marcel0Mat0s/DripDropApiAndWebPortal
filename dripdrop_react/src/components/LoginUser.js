import { useState } from "react"
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
    const token = useSelector(state => state.token);
  
    // Login function to authenticate user
    const login = async(email, password) => {
        try {

            // Send a POST request to the server
            const response = await axios.post('http://localhost:80/PHP-API/login', {email, password});
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

    return(
        <div>  
            <h1>Login User</h1>
            <form onSubmit={handleSubmit}>

                <table cellSpacing="10" align="center">

                    <tbody>
                        <tr>
                            <th>
                                <label>Email: </label>
                            </th>
                            <td>
                                <input type="text" name="email" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <label>Password: </label>
                            </th>
                            <td>
                                <input type="text" name="password" onChange={handleChange}/>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2" align="right">
                                <button>Login</button>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2" align="right">
                                <button onClick={logout}>Logout</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
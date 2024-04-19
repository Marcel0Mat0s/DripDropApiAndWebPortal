import { useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, removeToken } from './../redux/actions';

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

            // Set the token in the redux store and local storage
            dispatch(setToken(token));
            localStorage.setItem('token', token);

            console.log(token);
        } catch (error) {
            console.log('Authentication failed: ', error);
        }
    }
  
    // Logout function
    const logout = () => {
        dispatch(removeToken());
        localStorage.removeItem('token');

        console.log('Logged out');
    }

    return(
        <div>  
            <h1>Login User</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10">
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
                                <button>Save</button>
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
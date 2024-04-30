import { useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

export default function CreateUser(){

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:80/PHP-API/users/save', inputs).then(function(response){
            localStorage.setItem('token', response.data.token);
            console.log(response.data);
            navigate('/')
        })
        .catch(function(error){
            console.log('Authentication failed: ',error)
        })
    }
    
    return(
        <div>  
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10" align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Name: </label>
                            </th>
                            <td>
                                <input type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>

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
                    </tbody>
                </table>
            </form>
        </div>
    )
}
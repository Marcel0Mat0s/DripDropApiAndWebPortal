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
            <h1>Criar Conta</h1>
            <form onSubmit={handleSubmit}>
                <table align="center">
                    <tbody>
                        <tr>
                            <th>
                                <label>Nome: </label>
                            </th>
                            <td>
                                <input class="roundedS" type="text" name="name" onChange={handleChange}/>
                            </td>
                        </tr>

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
                                <button class="buttonYes">Criar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
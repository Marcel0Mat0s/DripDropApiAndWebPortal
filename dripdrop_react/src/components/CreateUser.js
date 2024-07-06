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

        ////////////////////////////// Validations //////////////////////////////
        // cheks if all fields are filled
        if(!inputs.name || !inputs.email || !inputs.password){
            alert('Por favor preencha todos os campos');
            return;
        }

        axios.post('http://193.137.5.80:80/PHP-API/users/save', inputs).then(function(response){
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
                                <button class="buttonYes">Criar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
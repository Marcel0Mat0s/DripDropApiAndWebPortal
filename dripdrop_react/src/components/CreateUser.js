import { useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

// View to create a user
export default function CreateUser(){

    // inicializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs state
    const [inputs, setInputs] = useState([])

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
     * 
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        ////////////////////////////// Validations //////////////////////////////

        // cheks if all fields are filled
        if(!inputs.name || !inputs.email || !inputs.password){
            alert('Por favor preencha todos os campos');
            return;
        }


        // sends the data to the API to create the user
        axios.post('https://dripdrop.danielgraca.com/PHP-API/users/save', inputs).then(function(response){
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
import { useState } from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";

// View to create a user
export default function CreateUser(){

    // inicializes the navigate function
    const navigate = useNavigate();

    // initializes the inputs state
    const [inputs, setInputs] = useState([])
    const [loading, setLoading] = useState(false);

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
    const handleSubmit = async (event) => {
        event.preventDefault();

        ////////////////////////////// Validations //////////////////////////////

        // checks if all fields are filled
        if (!inputs.name || !inputs.email || !inputs.password) {
            alert('Por favor preencha todos os campos');
            return;
        }

        // checks if the email already exists in the database
        try {
            setLoading(true);
            const response = await axios.get('https://dripdrop.danielgraca.com/PHP-API/users/get');
            const emailExists = response.data.some(user => user.email.toLowerCase() === inputs.email.toLowerCase());
            if (emailExists) {
                alert('O email introduzido já está associado a uma conta existente');
                setLoading(false);
                return;
            }
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
            return;
        }

        // sends the data to the API to create the user
        try {
            const response = await axios.post('https://dripdrop.danielgraca.com/PHP-API/users/save', inputs);
            localStorage.setItem('token', response.data.token);
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.log('Authentication failed: ', error);
            alert('Erro ao criar a conta, por favor tente novamente mais tarde');
        } finally {
            setLoading(false);
        }
    }


    /**
     * Function to show the password
     * 
     * @returns
     */
    function myFunction() {
        try{
            var x = document.getElementById("floatingPassword");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        } catch (error){
            console.log('Error: ', error)
        }
    }
    
    return(
        <div class="d-flex items-align-center">
            <div class="row p-0 w-100">
                
                <div className="whiteFullCard" class="col m-5 whiteFullCard">

                    <div class="h-25">  
                        <h1>Crie aqui a sua conta!</h1>
                        <br/>
                        <hr class="hr hr-blurry" />
                        <br/>
                    </div>
                    <div class="h-75">
                        <form onSubmit={handleSubmit}>
                            <table align="center" class="text-light w-75">
                                <thead>
                                    <tr>
                                        <td class="text-dark">
                                            <h2 align="left">Preencha os campos:</h2>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div class="form-floating mb-3">
                                        <input id="floatingName" class="form-control" type="name" name="name" onChange={handleChange} placeholder="nome"/>
                                        <label for="floatingName">Nome</label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingEmail" class="form-control" type="email" name="email" onChange={handleChange} placeholder="nome@example.com"/>
                                        <label for="floatingEmail">Email</label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input id="floatingPassword" class="form-control" type="password" name="password" onChange={handleChange} placeholder="password"/>
                                        <label for="floatingPassword">Palavra-passe</label>
                                        <div className="form-check d-flex justify-content-start" >
                                            <input className="form-check-input" type="checkbox" onClick={myFunction}/>
                                            <label className="text-dark fw-bold">Mostrar Palavra-passe</label>
                                        </div>
                                    </div>

                                    <tr>
                                        <td colSpan="2" align="right">
                                            <button class="btn btn-outline-success">Criar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>  
                </div> 
                <div className="whiteFullCard" class="col m-5 whiteFullCard">
                    <div class="h-25">
                        <h1 align="center">Já tem conta? 😃</h1>
                        <br/>
                        <hr class="hr hr-blurry" />
                        <br/>
                    </div>
                    <div class="h-75">
                        <br/>
                        <table align="center" class="w-75">
                            <tbody>
                                <tr>
                                    <td>
                                        <h2 align="left">Inicie Sessão!</h2>
                                        <br/>
                                        <p align='left'>Já tem conta? Não perca tempo e inicie sessão agora mesmo para começar a monitorizar as suas plantas!</p>
                                        <br/>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <button class="btn btn-outline-success" align="end" onClick={() => navigate('/login')}>Iniciar Sessão</button>
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
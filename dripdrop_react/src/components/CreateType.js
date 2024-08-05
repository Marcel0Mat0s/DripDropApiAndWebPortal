import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken, removeUserId, removeRole } from "../redux/actions";
import logo from '../images/dripdropdigital.png';

// View to create a new type
export default function CreateType() {
    // initializes the type state
    const [type, setType] = useState("");

    // gets the user ID from local storage
    const userId = localStorage.getItem("userId");

    // gets the navigate function from the router
    const navigate = useNavigate();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the types data from the API when the page loads
    useEffect(() => {
      // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

      // gets the types data from the API
      axios
          .get(`https://dripdrop.danielgraca.com/PHP-API/types`, config)
          .then(function (response) {
              console.log(response.data);
          }).catch(function(error){
            console.log(error);
            // ends the session if the token is invalid
            // Remove the token from the redux store and local storage
            dispatch(removeToken());
            localStorage.removeItem('token');

            // Remove the user id from the redux store and local storage
            dispatch(removeUserId());
            localStorage.removeItem('userId');

            // Remove the role from the redux store and local storage
            dispatch(removeRole());
            localStorage.removeItem('role');
            
            // navigates to the login page if the user is not authenticated
            navigate('/login');
            alert("Sessão expirada. Por favor faça login novamente.");
        });
    }, []);

    /**
     * Function to handle the change on the inputs
     * 
     * @param {object} event 
     * 
     */
    function handleChange(event){
        const {name, value} = event.target;
        setType({...type, [name]: value});
    }

    /**
     * Function to handle the submit event
     * 
     * @param {object} event
     * 
     * */
    function handleSubmit(event){
        event.preventDefault();

        //////////////// VALIDATION ////////////////
        // checks if the every field is filled
        if (!type.name || !type.max_humidity || !type.min_humidity || !type.min_NDVI) {
            alert("Por favor preencha todos os campos.");
            return;
        }



        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // sends the new type data to the API
        axios
            .post(`https://dripdrop.danielgraca.com/PHP-API/types`, type, config)
            .then(function (response) {
                console.log(response.data);
                navigate("/types");
            })
            .catch(function (error) {
                console.log(error);
                alert("Erro ao criar o tipo de planta, por favor tente novamente.");
            });
    }

    return (
        <div className="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
                  <br/>
                  <br/>
                  <div class="whiteFullCard d-flex items-align-center">
                      <div align="center" style={{width: '100%'}}>
                          <form onSubmit={handleSubmit}>
                              <table class="text-light w-75" cellSpacing="20" align="center" style={{margin: '50px'}}>
                                  <thead>
                                      <tr>
                                          <h2 class="text-dark" align="left">🌱Criar Tipo de Planta:</h2>
                                          <br/>
                                      </tr>
                                  </thead>
                                  <tbody>
                                          <div class="form-floating mb-3">
                                              <input id="floatingNome" class="form-control" type="name" name="name" onChange={handleChange} placeholder="nome"/>
                                              <label for="floatingNome" >Nome </label>
                                          </div>

                                          <div class="form-floating mb-3">
                                              <input id="floatingHmax" class="form-control" type="number" step=".5" name="max_humidity" onChange={handleChange} placeholder="Hmax"/>
                                              <label for="floatingHmax" >Humidade Máxima </label>
                                          </div>

                                          <div class="form-floating mb-3">
                                              <input id="floatingHmin" class="form-control" type="number" step=".5" name="min_humidity" onChange={handleChange} placeholder="Hmin"/> 
                                              <label for="floatingHmin" >Humidade Mínima </label>
                                          </div>

                                          <div class="form-floating mb-3">
                                              <input id="floatingNDVImin" class="form-control" type="number" step=".01" name="min_NDVI" onChange={handleChange} placeholder="NDVImin"/>
                                              <label for="floatingNDVImin" >NDVI Mínimo </label>
                                          </div>

                                          <div colSpan="2" align="right">
                                              <button class="btn btn-outline-success">Guardar</button>
                                          </div>
                                  </tbody>
                              </table>
                          </form>
                      </div>
                  </div>
      </div>
    );
}

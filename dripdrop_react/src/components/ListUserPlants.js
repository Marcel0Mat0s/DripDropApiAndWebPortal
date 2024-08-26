import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeToken, removeUserId, removeRole } from "../redux/actions";
import logo from '../images/dripdropdigital.png';


// View to list all the users
export default function ListUsers() {
    // initializes the users state
    const [plants, setPlants] = useState([]);

    // gets the id from the URL
    const {id} = useParams();

    // gets the user ID from the redux store
    const userId = useSelector((state) => state.auth.userId);

    // gets the role from the redux store
    const role = useSelector((state) => state.auth.role);

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the navigate function from the router
    const navigate = useNavigate();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the users data from the API when the page loads
    useEffect(() => {
        getUserPlants();
    }, []);

    /**
     * Function to get the users plants data from the API
     * 
     * */
    function getUserPlants() {

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // gets the users plants data from the API
        axios
            .get(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${id}///${role}`, config)
            .then(function (response) {
                console.log(response.data);
                setPlants(response.data);
            })
            .catch(function (error) {
                console.log(error);
                // ends the session if the token is invalid
                // Remove the token from the redux store and local storage
                dispatch(removeToken());
                localStorage.removeItem("token");

                // Remove the user id from the redux store and local storage
                dispatch(removeUserId());
                localStorage.removeItem("userId");

                // Remove the role from the redux store and local storage
                dispatch(removeRole());
                localStorage.removeItem("role");

                // navigates to the login page if the user is not authenticated
                navigate("/login");
                alert("Sessão expirada. Por favor faça login novamente.");
            });
    }

    /**
     * Function to delete a plant
     * 
     * @param {*} ID
     * 
     */
    const deletePlant = (id) => {

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // deletes the plant from the API
        axios.delete(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}/${id}/delete`, config).then(function(response){
            console.log(response.data);
            getUserPlants();
        }).catch(function(error){
            console.log(error);
            alert("Erro ao apagar a planta. Por favor tente novamente.");
        });
    }

    return (
        <div class="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <div class="w-100" >
                <button class='buttonBlue position-relative top-50 start-50 float-right fs-4 text-center pb-2' style={{ width:"40px", height:"40px"}} onClick={() => navigate(`/user/${id}/plants/create`)}>+</button>
            </div>
            <div class=" w-100 whiteFullCard" style={{backgroundColor: "#212529"}}>
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {plants.map((plant) => (
                        <tr key={plant.id}>
                            <td>{plant.id}</td>
                            <td>{plant.name}</td>
                            <td>
                                <Link to={`/plant/${plant.id}/edit`} class="btn btn-info mx-1">Editar</Link>
                                <button class="btn btn-danger" onClick={() => deletePlant(plant.id)}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}
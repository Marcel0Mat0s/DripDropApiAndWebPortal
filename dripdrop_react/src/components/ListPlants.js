import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId, removeRole } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// View to list all the plants of a user
export default function ListPlants(){

    // initializes the plants state
    const [plants, setPlants] = useState([]);

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the user ID from the redux store
    const userId = useSelector((state) => state.auth.userId);

    // gets the navigate function from the router
    const navigate = useNavigate();

    // gets the dispatch function from the redux store
    const dispatch = useDispatch();

    // gets the plants data from the API when the page loads
    useEffect(() => {
        getPlants();
    }, []);

    /**
     * Function to get the plants data from the API
     * 
     */
    function getPlants(){

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plants data from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}`, config).then(function(response){
            console.log(response.data);
            setPlants(response.data);
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
    }

    /**
     * Function to navigate to a path
     * 
     * @param {*} path
     * @returns
     */
    const goTo = (path) => () => {
        window.location.href = path;
    }

    return(
        <div class="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <div class="w-100" >
                <button class='buttonBlue position-relative top-50 start-50 float-right fs-4 text-center pb-2' style={{ width:"40px", height:"40px"}} onClick={goTo("/plant/create")}>+</button>
            </div>
            <div class=" w-100 whiteFullCard">
                <div class="row d-flex justify-content-evenly" >
                    {plants.map((plant, key) =>
                        <div className="blueFullBoard" class="col-2 blueFullCard" key={key}>
                            <Link style={{color: '#000000', textDecoration: 'none'}} to={`/states/${plant.id}/${plant.type}/${plant.name}`} >{plant.name}</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    )
}
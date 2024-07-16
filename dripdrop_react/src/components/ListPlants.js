import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import logo from '../images/dripdropdigital.png';
import { removeToken, removeUserId } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// View to list all the plants of a user
export default function ListPlants(){

    // initializes the plants state
    const [plants, setPlants] = useState([]);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

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
        const token = localStorage.getItem('token');
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
            // navigates to the login page if the user is not authenticated
            navigate('/login');
        });
    }



    /**
     * Function to delete a plant
     * 
     * @param {*} id
     * @returns
     */
    const deletePlant = (id) => {

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // deletes the plant from the API
        axios.delete(`https://dripdrop.danielgraca.com/PHP-API/plants/${id}/${userId}/${id}/delete`, config).then(function(response){
            console.log(response.data)
            getPlants();
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
        <div class="">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <div class="w-100" >
                <button class='buttonBlue position-relative top-50 start-50 float-right' style={{marginRight: '60px', marginBottom: '10px', width:"40px", height:"40px"}} onClick={goTo("/plant/create")}>+</button>
            </div>
            <div class=" w-100 whiteFullCard">
                <div class="row" >
                    {plants.map((plant, key) =>
                        <div className="blueFullBoard" class="col blueFullCard" key={key}>
                            <Link style={{color: '#000000', textDecoration: 'none'}} to={`/states/${plant.id}/${plant.type}/${plant.name}`} >{plant.name}</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    )
}
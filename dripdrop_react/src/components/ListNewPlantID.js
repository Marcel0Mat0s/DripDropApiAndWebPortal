// Page that shows the new plant ID after the user creates a new plant

import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ListNewPlantID() {

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        getPlants();
    });

    // Gets the plants from the API
    function getPlants(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get(`http://193.137.5.80:80/PHP-API/plants/null/${userId}`, config).then(function(response){
            console.log(response.data)

            // gets the last plant ID from the response.data array and sets it in the html
            document.getElementById('plantId').innerHTML = response.data[response.data.length - 1].id;

        });
    }

    return(
        <div>
            <h1>O ID da sua nova planta é:</h1>
            <h1 id='plantId'>x</h1>
            <p>Clique <a style={{color: 'grey'}} href='https://192.168.4.1:5000' target="_blank" rel="noopener noreferrer">aqui</a> após 
            se conectar à rede:</p>
            <p> DripDropDigital do dispositivo com a palavra-passe "dripdrop123#" para o configurar</p>
            <br/>

            <button class='buttonYes' onClick={() => navigate('/main')}>Continuar</button>
        </div>
    );
}
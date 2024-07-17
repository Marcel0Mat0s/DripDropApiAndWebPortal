import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/dripdropdigital.png';

// View to list the new plant ID
export default function ListNewPlantID() {

    // initializes the navigate function
    const navigate = useNavigate();

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // gets the plant ID when the page loads
    useEffect(() => {
        getPlants();
    });

    /**
     * Function to get the plant ID from the API
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

        // gets the plant ID from the API
        axios.get(`https://dripdrop.danielgraca.com/PHP-API/plants/null/${userId}`, config).then(function(response){
            console.log(response.data)

            // gets the last plant ID from the response.data array and sets it in the html
            document.getElementById('plantId').innerHTML = response.data[response.data.length - 1].id;

        });
    }

    return(
        <div>  
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div class='container whiteCard'>
                <table align='center'>
                    <thead>
                        <tr>
                            <h1 align="left">O ID da sua nova planta é:</h1>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <h1 id='plantId'>x</h1>
                        </tr>
                        <tr>
                            <p align="left">Clique <a style={{color: 'grey'}} href='https://192.168.4.1:5000' target="_blank" rel="noopener noreferrer">aqui</a> após 
                            se conectar à seguinte rede do dispositivo:</p>
                        </tr>
                        <tr>
                            <td align='left'>
                                <p class="fw-bold w-auto">SSID - DripDropDigital</p>
                                <p class="fw-bold w-auto">Palavra-Passe - dripdrop123#</p>
                            </td>
                            
                        </tr>
                        <tr>
                            <p align="left" class="w-auto">Desta forma pode fácilmente configurar-lo e desfrutar!🫡</p>
                        </tr>
                        <tr align="right">
                            <button class='btn btn-outline-success'  onClick={() => navigate('/main')}>Continuar</button>
                        </tr>

                    </tbody>

                    
                </table>
            </div>

        </div>
    );
}
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement} from 'chart.js';
import { removeToken, removeUserId } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { m } from "framer-motion";
import { point } from "leaflet";


// Register the ChartJS plugins
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

// View to list all the states of a plant
export default function ListAllStates(){

    // initializes the navigate function
    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();
    // gets the plant type from the URL
    const {plantType} = useParams();

    // initializes the state
    const [state, setState] = useState([]);
    const [minHumidity, setMinHumidity] = useState();
    const [maxHumidity, setMaxHumidity] = useState();
    const [minNDVI, setMinNDVI] = useState();

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // initializes the dispatch function
    const dispatch = useDispatch();

    // gets the plant data from the API when the page loads
    useEffect(() => {
        
        getAllState();
        getType();
        
    }, [plantId]);

    /**
     * 
     * Function to get the type of a plant from the API
     * 
     */
    function getType(){
            
            // gets the token from local storage and sets it in the headers
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            // gets the plant type from the API
            axios.get(`https://dripdrop.danielgraca.com/PHP-API/types/${plantType}/${userId}`, config).then(function(response){
                console.log(response.data)
                setMinHumidity(response.data.min_humidity);
                setMaxHumidity(response.data.max_humidity);
                setMinNDVI(response.data.min_NDVI);
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
                alert("Sessão expirada. Por favor faça login novamente.");
            });
    }

    /**
     * Function to get all the states of a plant from the API
     * 
     * @returns
     */
    function getAllState(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant states from the API
        axios.get( `https://dripdrop.danielgraca.com/PHP-API/states/null/${userId}/${plantId}/all`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
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
            alert("Sessão expirada. Por favor faça login novamente.");
        });
    }

    /**
     * 
     * Function to format the image source to display it in the table
     * 
     * @param {*} image 
     * @returns 
     */
    function formatImageSrc(image){
        return `data:image/png;base64,${image}`;
    }
 
    /**
     * 
     * Function to export the states to an Excel file
     * 
     * @param {*} data 
     */
    function toExcel(data){

        const sanitizedData = data.map(item => ({
            plant: item.plant,
            humidity_air: item.humidity_air,
            temperature: item.temperature,
            wind_direction: item.wind_direction,
            wind_speed: item.wind_speed,
            precipitation: item.precipitation,
            humidity_soil: item.humidity_soil,
            ndvi: item.ndvi,
            date: item.date,
            time: item.time,
            // Does not include image in the Excel file to avoid size and format issues
        }));
        
        // Create a new wprksheet
        const ws = XLSX.utils.json_to_sheet(sanitizedData);

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Plant States");

        // Create a blob from the workbook
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        // Trigger the download of the xls file 
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PlantStates.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        //////////////////////////////////////////// ZIP IMAGES FILE ////////////////////////////////////////////

        // Downloads the images from the states to a zip file with the date and time as the name
        const zip = new JSZip();
        const folder = zip.folder("PlantStatesImages");

        // For each state, add the image to the zip file
        data.forEach((item, index) => {
            // Get the base64 image
            const image = item.image;

            // format the image source
            const imageFormat = formatImageSrc(image);

            // Create a new image element
            const newImage = new Image();

            // Set the source of the image
            newImage.src = imageFormat;

            // Add the image to the zip file
            folder.file(`${item.date}_${item.time}.png`, newImage.src.substr(newImage.src.indexOf(',') + 1), {base64: true});
        });

        // Generate the zip file and download it
        folder.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, `Images.zip`);
        });

    }    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// CHARTS ////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////// NDVI //////////////////////////////////////////////

    /**
     * Function to format the data to display in the chart
     * 
     */
    const ndviData = {

        // label and data for the x-axis 
        labels: state.map(item => item.date).reverse(),

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'NDVI',
                // data for the y-axis
                data: state.map(item => item.ndvi).reverse(),
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                // label for the y-axis
                label: 'Mínimo',
                // data for the y-axis
                data: state.map(item => minNDVI).reverse(),
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(145, 14, 4)',
                borderColor: 'rgba(145, 14, 4)',
                pointRadius: 0,
                pointHoverRadius: 0,
            }
        ],
    };

    /**
     * Options for the NDVI chart
     * 
     */
    const ndviOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'NDVI',
                },
            },
        },
    };

    //////////////////////////////////////////// Precipitation //////////////////////////////////////////////

    /**
     * 
     * Function to format the data to display in the chart
     *  
     */
    const precipitationData = {
            
            // label and data for the x-axis
            labels: state.map(item => item.date + ' ' + item.time).reverse(),
    
            // datasets for the chart
            datasets: [
                {
                    // label for the y-axis
                    label: 'Precipitação',
                    // data for the y-axis
                    data: state.map(item => item.precipitation).reverse(),
                    tension: 0.5,
                    fill: true,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        };

    /**
     * Options for the Precipitation chart
     *  
     * @returns
     *  
     * */
    const precipitationOptions = {
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                }
            },
            y: {
                stacked: true,
                title: {
                    display: false,
                    text: 'Precipitação',
                },
            },
        },
    };

    /////////////////////////////////////////// TEMPERATURE / HUMIDITY SOIL ////////////////////////////////////////////

    /**
     * 
     * Function to format the data to display in the chart
     * 
     */
    const temperatureData = {
                    
                // label and data for the x-axis 
                labels: state.map(item => item.date + ' ' + item.time).reverse(),
            
                // datasets for the chart
                datasets: [
                {
                    // label for the y-axis
                    label: 'Humidade do Solo',
                    // data for the y-axis
                    data: state.map(item => item.humidity_soil).reverse(),
                    tension: 0.5,
                    backgroundColor: 'rgb(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    // label for the y-axis
                    label: 'Temperatura',
                    // data for the y-axis
                    data: state.map(item => item.temperature).reverse(),
                    tension: 0.5,
                    backgroundColor: 'rgb(192, 75, 75, 1)',
                    borderColor: 'rgba(192, 75, 75, 0.2)',
                    fill: true,
                },
                {
                    // label for the y-axis
                    label: 'H. Min.',
                    // data for the y-axis
                    data: state.map(item => minHumidity).reverse(),
                    tension: 0.5,
                    backgroundColor: 'rgb(145, 14, 4, 1)',
                    borderColor: 'rgba(145, 14, 4, 1)',
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
                {
                    // label for the y-axis
                    label: 'H. Max.',
                    // data for the y-axis
                    data: state.map(item => maxHumidity).reverse(),
                    tension: 0.5,
                    backgroundColor: 'rgb(14, 110, 14, 1)',
                    borderColor: 'rgba(14, 110, 14, 1)',
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
            ],
        };

    /**
     * 
     * Options for the Temperature chart
     * 
     */
    const temperatureOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                },
            },
            y: {
                title: {
                    display: false,
                    text: 'Valores',
                },
            },
        },
    };
    
    ////////////////////////////////////// IRRIGATION //////////////////////////////////////

    /*
     *
     * Function to format the data to display in the chart
     * 
     */
    const irrigationData = {
        // label and data for the x-axis
        labels: state.map(item => item.date + ' ' + item.time).reverse(),

        // datasets for the chart
        datasets: [
            {
                label: 'Irrigação ON',
                data: state.map(state => (state.irrigation === 'ON' ? 1 : 0)),
                backgroundColor: 'rgba(75, 192, 192, 1)',
                stack: 'irrigation',
            },
            {
                label: 'Irrigação OFF',
                data: state.map(state => (state.irrigation === 'OFF' ? 1 : 0)),
                backgroundColor: 'rgba(192, 75, 75, 1)',
                stack: 'irrigation',
            },
        ],
    };

    /*
     *
     * Options for the Irrigation chart
     * 
     */
    const irrigationOptions = {
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                }
            },
            y: {
                stacked: true,
                title: {
                    display: false,
                    text: 'Irrigação',
                },
                ticks: {
                    display: false
                },
            },
        },
    };

    ////////////////////////////////////////// WIND SPEED ////////////////////////////////////////////

    /**
     *  
     * Function to format the data to display in the chart
     *  
     */
    const windSpeedData = {

        // label and data for the x-axis
        labels: state.map(item => item.date + ' ' + item.time).reverse(),

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'Velocidade do Vento',
                // data for the y-axis
                data: state.map(item => item.wind_speed).reverse(),
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    /**
     * 
     * Options for the Wind Speed chart 
     * 
     */
    const windSpeedOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'Velocidade do Vento',
                },
            },
        },
    };

    /////////////////////////////////////////// NDVI / HUMIDITY SOIL ////////////////////////////////////////////

    /**
     *  
     * Function to format the data to display in the chart
     *  
     **/
    const ndviHumiditySoilData = {

        // label and data for the x-axis
        labels: state.map(item => item.date + ' ' + item.time).reverse(),

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'Humidade do Solo',
                // data for the y-axis
                data: state.map(item => item.humidity_soil).reverse(),
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                // label for the y-axis
                label: 'NDVI',
                // data for the y-axis
                data: state.map(item => item.ndvi).reverse(),
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(192, 75, 75)',
                borderColor: 'rgba(192, 75, 75, 0.2)',
            },
        ],
    };

    /**
     *  
     *  Options for the NDVI / Humidity Soil chart
     * 
     **/
    const ndviHumiditySoilOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data e Hora',
                },
                ticks: {
                    display: false
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'Valores',
                },
            },
        },
    };


    return(
        <div class="w-100" style={{padding: '12px', alignContent: 'center'}}>
            <div class="d-flex justify-content-between m-2">
                <button class='btn btn-outline-success' onClick={() => toExcel(state)} style={{ align: "left", paddingLeft: "12px" }}>Transferir</button>
            </div>
            <div class="row w-100 d-flex justify-content-between" style={{padding: '12px', height:"80vh"}}>

                <div key="precipitation-chart" class="col-3 whiteCard m-2" style={{alignContent: 'center'}}>
                    <Bar data={precipitationData} options={precipitationOptions} class="w-100"/>
                </div>

                <div key="ndvi-chart" class="col whiteCard m-2" style={{alignContent: 'center'}}>
                    <Line data={ndviData} options={ndviOptions} class="w-100"/>
                </div>

                <div class="col whiteCard m-2" style={{alignContent: 'center'}}>
                    <Line data={temperatureData} options={temperatureOptions} class="w-100"/>
                </div>

                <div class="w-100"></div>

                <div class="col whiteCard m-2" style={{alignContent: 'center'}}>
                    <Line data={ndviHumiditySoilData} options={ndviHumiditySoilOptions} class="w-100"/>
                </div>

                <div class="col whiteCard m-2" style={{alignContent: 'center'}}>
                    <Bar data={irrigationData} options={irrigationOptions} class="w-100" />
                </div>

                <div class="col-3 whiteCard m-2" style={{alignContent: 'center'}}>
                <Line data={windSpeedData} options={windSpeedOptions} class="w-100"/>
                </div>
            
            </div>
        </div>
    )
}
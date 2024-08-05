import { useEffect, useState, useRef } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement} from 'chart.js';
import { removeToken, removeUserId, removeRole } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
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
    // gets the plant name from the URL
    const {plantName} = useParams();

    // initializes the state
    const [state, setState] = useState([]);
    const [stateByDay, setStateByDay] = useState();
    const [minHumidity, setMinHumidity] = useState();
    const [maxHumidity, setMaxHumidity] = useState();
    const [minNDVI, setMinNDVI] = useState();
    const [selectedDate, setSelectedDate] = useState('');

    const chartRefs = useRef([]);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // initializes the dispatch function
    const dispatch = useDispatch();

    // gets the token from the redux store
    const token = useSelector((state) => state.auth.token);

    // gets the plant data from the API when the page loads
    useEffect(() => {
        
        getAllState();
        
    }, [plantId]);

    useEffect(() => {
        if (selectedDate) {
            console.log(selectedDate);
            getStateByDate(selectedDate);
            //const day = selectedDate.split("-")[2];
            //const filteredStates = state.filter(item => item.date.split("-")[2] === day);
            //setStateByDay(filteredStates);
        } else {
            setStateByDay(state);
        }
    }, [selectedDate, state]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    /**
     * Function to get the states of a plant from the API from a specific date
     * 
     * @param {*} date
     */
    function getStateByDate(date){
            
        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        // gets the plant states from the API
        axios.get( `https://dripdrop.danielgraca.com/PHP-API/states/${date}/${userId}/${plantId}/${date}`, config).then(function(response){
            console.log(response.data)
            setStateByDay(response.data)
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
     * Function to get all the states of a plant from the API
     * 
     * @returns
     */
    function getAllState(){

        // gets the token from local storage and sets it in the headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // gets the plant states from the API
        axios.get( `https://dripdrop.danielgraca.com/PHP-API/states/null/${userId}/${plantId}/all`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
            setStateByDay(response.data)
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

            // Remove the role from the redux store and local storage
            dispatch(removeRole());
            localStorage.removeItem('role');
            
            // navigates to the login page if the user is not authenticated
            navigate('/login');
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

    /**
     * Function to make the div with full width (makes him col-12)
     * 
     * @param {*} event
     * @returns
     */
    function fullScreen(event){
        const target = event.currentTarget;
        const isFullScreen = target.classList.contains('col-12');
        const parentElement = target.parentElement;
        target.classList.toggle('col-12');
        if (isFullScreen) {
            // Reset height if already full screen
            target.style.height = '40vh';
        } else {
            // Set height to 80vh if not full screen
            target.style.height = '80vh';
        }

        // Move the clicked div to the top of its parent container
        parentElement.insertBefore(target, parentElement.firstChild);
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
        labels: stateByDay ? stateByDay.map(item => item.date).reverse() : [],
        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'NDVI',
                // data for the y-axis
                data: stateByDay ? stateByDay.map(item => item.ndvi).reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                // label for the y-axis
                label: 'Mínimo',
                // data for the y-axis
                data: stateByDay ? stateByDay.map(item => minNDVI).reverse() : [],
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
            responsive: true,
            maintainAspectRatio: false,
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
            labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],
    
            // datasets for the chart
            datasets: [
                {
                    // label for the y-axis
                    label: 'Precipitação',
                    // data for the y-axis
                    data: stateByDay ? stateByDay.map(item => item.precipitation).reverse() : [],
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
            responsive: true,
            maintainAspectRatio: false,
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
                labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],
            
                // datasets for the chart
                datasets: [
                {
                    // label for the y-axis
                    label: 'Humidade do Solo',
                    // data for the y-axis
                    data: stateByDay ? stateByDay.map(item => item.humidity_soil).reverse() : [],
                    tension: 0.5,
                    backgroundColor: 'rgb(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    // label for the y-axis
                    label: 'Temperatura',
                    // data for the y-axis
                    data: stateByDay ? stateByDay.map(item => item.temperature).reverse() : [],
                    tension: 0.5,
                    backgroundColor: 'rgb(192, 75, 75, 1)',
                    borderColor: 'rgba(192, 75, 75, 0.2)',
                    fill: true,
                },
                {
                    // label for the y-axis
                    label: 'H. Min.',
                    // data for the y-axis
                    data: stateByDay ? stateByDay.map(item => minHumidity).reverse() : [],
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
                    data: stateByDay ? stateByDay.map(item => maxHumidity).reverse() : [],
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
            responsive: true,
            maintainAspectRatio: false,
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
        labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],

        // datasets for the chart
        datasets: [
            {
                label: 'Irrigação ON',
                data: stateByDay ? stateByDay.map(state => (state.irrigation === 'ON' ? 1 : 0)) : [],
                backgroundColor: 'rgba(75, 192, 192, 1)',
                stack: 'irrigation',
            },
            {
                label: 'Irrigação OFF',
                data: stateByDay ? stateByDay.map(state => (state.irrigation === 'OFF' ? 1 : 0)) : [],
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
            responsive: true,
            maintainAspectRatio: false,
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
        labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'Velocidade do Vento',
                // data for the y-axis
                data: stateByDay ? stateByDay.map(item => item.wind_speed).reverse() : [],
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
            responsive: true,
            maintainAspectRatio: false,
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
        labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'Humidade do Solo',
                // data for the y-axis
                data: stateByDay ? stateByDay.map(item => item.humidity_soil).reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                // label for the y-axis
                label: 'NDVI',
                // data for the y-axis
                data: stateByDay ? stateByDay.map(item => item.ndvi).reverse() : [],
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
            responsive: true,
            maintainAspectRatio: false,
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


    ////////////////////////////////////////////////////////////////////////////////////////////////

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: true, text: 'Data e Hora' },
                ticks: { display: false }
            },
            y: {
                title: { display: false },
            },
        },
    };

    const createChartData = (label, dataPoints, label2, dataPoints2 = [], minData , maxData) => ({
        labels: stateByDay ? stateByDay.map(item => item.date + ' ' + item.time).reverse() : [],
        datasets: [
            {
                label,
                data: stateByDay ? dataPoints.reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            ...(dataPoints2.length ? [{
                label: label2,
                data: stateByDay ? dataPoints2.reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(192, 75, 75)',
                borderColor: 'rgba(192, 75, 75, 0.2)',
            }] : []),
            ...(typeof minData != 'undefined' ? [{
                label: 'Mínimo',
                // mindata is a number
                data: stateByDay ? minData.reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(145, 14, 4)',
                borderColor: 'rgba(145, 14, 4)',
                pointRadius: 0,
                pointHoverRadius: 0,
            }] : []),
            ...(typeof maxData != 'undefined' ? [{
                label: 'Máximo',
                data: stateByDay ? maxData.reverse() : [],
                tension: 0.5,
                fill: false,
                backgroundColor: 'rgb(14, 110, 14)',
                borderColor: 'rgba(14, 110, 14)',
                pointRadius: 0,
                pointHoverRadius: 0,
            }] : []),
        ],
    });

    

    const ndviDataVar = createChartData('NDVI',stateByDay ? stateByDay.map(item => item.ndvi) : [] , [], [], minNDVI ? stateByDay.map(item => minNDVI) : []);
    const precipitationDataVar = createChartData('Precipitação',stateByDay ? stateByDay.map(item => item.precipitation) : [] );
    const temperatureDataVar = createChartData('Temperatura',stateByDay ? stateByDay.map(item => item.temperature) : []);
    const ndviHumiditySoilDataVar = createChartData('NDVI', 
                                                    stateByDay ? stateByDay.map(item => item.ndvi) : [] , 
                                                    'Humidade do Solo', 
                                                    stateByDay ? stateByDay.map(item => item.humidity_soil) : [], 
                                                    minHumidity ? stateByDay.map(item => minHumidity) : [], 
                                                    maxHumidity ? stateByDay.map(item => maxHumidity) : []);
    const irrigationDataVar = createChartData('Irrigação',stateByDay ? stateByDay.map(item => item.irrigation === 'ON' ? 1 : 0) : [], 'Irrigação OFF', stateByDay ? stateByDay.map(item => item.irrigation === 'OFF' ? 1 : 0) : []);
    const windSpeedDataVar = createChartData('Velocidade do Vento',stateByDay ? stateByDay.map(item => item.wind_speed) : [] );

    return(
        <div class="w-100" style={{padding: '12px', alignContent: 'center'}}>
            <div class="d-flex justify-content my-2">
                <button class='btn btn-outline-info' onClick={() => navigate(`/states/${plantId}/${plantType}/${plantName}`)} style={{ align: "right", paddingLeft: "12px" }}>Voltar</button>
                <button class='btn btn-outline-success' onClick={() => toExcel(state)} style={{ align: "left", marginLeft: "12px" }}>Transferir</button>
                <input id="dia" type="date" class="form-control" placeholder="Pesquisar" style={{width: '200px', align: "left", marginLeft: "12px"}} onChange={handleDateChange}/>
            </div>
            <div class="row w-100 d-flex justify-content-between" style={{padding: '0px', height:"80vh"}}>

                <div key="precipitation-chart" class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Bar data={precipitationDataVar} options={precipitationOptions} class="w-100" ref={el => chartRefs.current[0] = el}/>
                    </div>
                </div>

                <div key="ndvi-chart" class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Line data={ndviDataVar} options={chartOptions} class="w-100" ref={el => chartRefs.current[1] = el}/>
                    </div>
                </div>

                <div class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Line data={temperatureDataVar} options={chartOptions} class="w-100" ref={el => chartRefs.current[2] = el}/>
                    </div>
                </div>

                <div class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Line data={ndviHumiditySoilDataVar} options={chartOptions} class="w-100" ref={el => chartRefs.current[3] = el}/>
                    </div>
                </div>

                <div class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Bar data={irrigationDataVar} options={chartOptions} class="w-100" ref={el => chartRefs.current[4] = el}/>
                    </div>
                </div>

                <div class="col-4 p-2 m-0" style={{alignContent: 'center', height: '40vh'}} onClick={fullScreen}>
                    <div class="whiteCard h-100">
                    <Line data={windSpeedDataVar} options={chartOptions} class="w-100" ref={el => chartRefs.current[5] = el}/>
                    </div>
                </div>
            
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';


// Register the ChartJS plugins
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// View to list all the states of a plant
export default function ListAllStates(){

    // initializes the navigate function
    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();

    // initializes the state
    const [state, setState] = useState([]);

    // gets the user ID from local storage
    const userId = localStorage.getItem('userId');

    // gets the plant data from the API when the page loads
    useEffect(() => {
        
        getAllState();
        
    }, [plantId]);

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
     * Function to format the data to display in the chart
     * 
     */
    const ndviData = {

        // label and data for the x-axis 
        labels: state.map(item => item.date + ' ' + item.time).reverse(),

        // datasets for the chart
        datasets: [
            {
                // label for the y-axis
                label: 'NDVI',
                // data for the y-axis
                data: state.map(item => item.ndvi).reverse(),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
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
            },
            y: {
                title: {
                    display: true,
                    text: 'NDVI',
                },
            },
        },
    };


    return(
        <div>
            <h1>Estados da Planta</h1>
            
            <table align="center">
                <tr>
                    <td>
                    <button class='buttonYes' onClick={() => navigate('/plants')}>Voltar</button>
                    </td>
                    <td>
                    <button class='buttonYes' onClick={() => toExcel(state)}>Transferir</button>
                    </td>
                </tr>
            </table>
            <br/>
            <Line data={ndviData} options={ndviOptions} />
            <br/>
            <table align="center">
                <tbody>
                    <tr>
                        <td>
                            <table class="whiteCard" align='center' style={{width: '200px', height: '150px'}}>
                                <thead>
                                    <th>Planta</th>
                                    <th>Humidade do Ar</th>
                                    <th>Temperatura</th>
                                    <th>Direção do Vento</th>
                                    <th>Velocidade do Vento</th>
                                    <th>Precipitação</th>
                                    <th>Humidade do Solo</th>
                                    <th>NDVI</th>
                                    <th>Data</th>
                                    <th>Hora</th>
                                    <th>Imagem</th>
                                </thead>
                                <tbody>
                                    {state.map((state, key) =>
                                        <tr key={key}>
                                            <td>{state.plant}</td>
                                            <td>{state.humidity_air}</td>
                                            <td>{state.temperature}</td>
                                            <td>{state.wind_direction}</td>
                                            <td>{state.wind_speed}</td>
                                            <td>{state.precipitation}</td>
                                            <td>{state.humidity_soil}</td>
                                            <td>{state.ndvi}</td>
                                            <td>{state.date}</td>
                                            <td>{state.time}</td>
                                            <td><img src={formatImageSrc(state.image)} alt="Imagem do estado da planta" style={{width: '250px', height: '250px'}}/></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/>
        </div>
    )

}
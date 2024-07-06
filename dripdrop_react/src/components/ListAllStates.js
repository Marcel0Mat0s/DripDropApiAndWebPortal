import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ListAllStates(){

    const navigate = useNavigate();

    // gets the plant id from the URL
    const {plantId} = useParams();

    const [state, setState] = useState([]);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        
        getAllState();
        
    }, [plantId]);

    function getAllState(){

        // gets the token from local storage and sets it in the headers
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.get( `http://193.137.5.80:80/PHP-API/states/null/${userId}/${plantId}/all`, config).then(function(response){
            console.log(response.data)
            setState(response.data)
        });
    }

    // Function to decode the image from the database (base64) and display it
    function formatImageSrc(image){
        return `data:image/png;base64,${image}`;
    }

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) : text;
    }
 
    // Function to export the data to an excel file and download it
    function toExcel(data){

        const sanitizedData = data.map(item => ({
            plant: truncateText(item.plant, 32767),
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

        // Trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PlantStates.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        // Downloads the images from the states to a zip file with the date and time as the name
        const zip = new JSZip();
        const folder = zip.folder("PlantStatesImages");
        // For each state, add the image to the zip file
        data.forEach((item, index) => {
            const image = item.image;
            const base64 = image.split(',')[1];
            folder.file(`${item.date}_${item.time}.png`, base64, {base64: true});
        });

        // Generate the zip file and download it
        folder.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, `${data[0].date}_${data[0].time}_Images.zip`);
        });

    }    

    // NDVI Chart
    const ndviData = {
        // Invert the order of the states to display the most recent first

        labels: state.map(item => item.date + ' ' + item.time).reverse(),

        datasets: [
            {
                label: 'NDVI',
                data: state.map(item => item.ndvi).reverse(),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

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
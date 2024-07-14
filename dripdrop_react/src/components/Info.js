import logo from '../images/dripdropdigital.png';

// view with the tutorial information to display
export default function Info(){
    return(
        <div>
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div className="whiteFullCard" class="d-flex items-align-center whiteFullCard">
                <table align='center' >
                    <tbody>
                        <tr>
                            <th>
                                <h1>1. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Conecte o seu dispositivo DripDrop a uma fonte de alimentação</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>2. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Crie uma "Planta" para obter o numero de identificação da mesma.</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>3. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Copie o número e ligue-se à rede DripDripDigital com a palavra-passe "dripdrop123#".</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>4. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Clique onde lhe será dito para preencher um formulário com a sua rede e o nº dado.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
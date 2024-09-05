import logo from '../images/dripdropdigital.png';

// view with the tutorial information to display
export default function Info(){
    return(
        <div class="container">
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div class="d-flex items-align-center whiteFullCard">
                <table align='center' >
                    <tbody>
                        <tr>
                            <th>
                                <h1>1. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Conecte o seu dispositivo DripDrop a uma fonte de alimentação.</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>2. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Crie uma "Plantação".</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>3. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Ligue-se à rede DripDropDigital com a palavra-passe "dripdrop123#".</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>4. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Escolha o seu navegador preferido e aceda ao seguinte portal:</p>
                                <a href="http://192.168.4.1:5000" target="_blank">http://DripDropDispositivo.local</a>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>5. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Preencha o formulário com a sua rede.</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>6. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Adicione o seu dispositivo à sua conta com o endereço que se encontra no mesmo.</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>7. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Adicione o seu dispositivo à sua conta com o endereço que se encontra no mesmo.</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>8. </h1>
                            </th>
                            <td align="left">
                                <p class="m-0">Espere e desfrute até quando o sol mais raiar para verificar os dados da sua plantação.🌾</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
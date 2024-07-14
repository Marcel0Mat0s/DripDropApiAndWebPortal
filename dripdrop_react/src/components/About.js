import logo from '../images/dripdropdigital.png';

// view to display the about page
export default function About(){
    return(
        <div>
            <img src={logo} alt='DripDrop' style={{width: '220px'}} />
            <br/>
            <br/>
            <div className="whiteFullCard d-flex items-align-center">
                <table align='center' style={{width: '70%'}}>
                    <tbody>
                        <tr>
                            <th align="center">
                                <h1>!</h1>
                            </th>
                            <td align="left">
                                <p>Esta aplicação IOT permite monitorizar um sistema de irrigação inteligente, que se adapta às condições climáticas e às necessidades das plantas. A aplicação foi desenvolvida por dois alunos de engenharia informática, no âmbito das unidades curriculares Internet das Coisas e Projeto Final</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>👨🏻‍💻 </h1>
                            </th>
                            <td align="left">
                                <p>Marcelo Matos</p>
                                <p>Nº 23028</p>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <th>
                                <h1>👨🏻‍💻 </h1>
                            </th>
                            <td align="left">
                                <p>Gonçalo Alpalhão</p>
                                <p>Nº 23048</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
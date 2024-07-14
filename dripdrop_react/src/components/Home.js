
import logo from '../images/dripdropdigital.png';

// view to display the home page
export default function Home(){

    return(

        <div >
            <div class="row w-100">

                <div class="col p-0 ">
                    <img src={logo} alt='DripDrop' class="w-75" />
                </div>

                <div class="col p-0 d-flex align-items-center">
                    <table align='center' class="w-75 " >
                        <tbody>
                            <tr>
                                <td>
                                    <h1 align="left">Bem-vindo</h1>
                                    <br/>
                                    <p align='left'>Integrando tecnologias IoT e algoritmos de análise de dados, o DripDrop optimiza o uso de recursos hídricos, respondendo aos desafios impostos pelas alterações climáticas e pelo aumento da população mundial.</p>
                                    <p align='left'>A utilização de hardware de baixo custo em conjunto com a comunicação por cloud torna este sistema uma ferramenta sustentável para integração em plantações, ajudando a cumprir com os objetivos de desenvolvimento sustentável</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    )
}
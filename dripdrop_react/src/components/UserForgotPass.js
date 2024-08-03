import React from "react";
import { Link } from "react-router-dom";
import logo from '../images/dripdropdigital.png';

// View to display the instructions to reset the password
export default function UserForgotPass() {
    return (
        <div className="container">
            <img src={logo} alt="logo" className="logo" />
            <br />
            <br />
            <div class="whiteFullCard d-flex items-align-center">
                <div align="center" style={{width: '100%'}}>

                    <h1>Esqueceu-se da sua password?🤯</h1>
                    <br />
                    <hr className="hr hr-blurry" />
                    <br />
                    
                    <table align='center' >
                        <tbody>
                            <tr>
                                <th>
                                    <h1></h1>
                                </th>
                                <td align="left">
                                    <p className="fs-3 fw-bold">Não se estresse, só precisa de seguir os seguintes passos:</p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h1>1. </h1>
                                </th>
                                <td align="left">
                                    <p class="my-0 mx-3 fs-4">Abra o seu mail </p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h1>2. </h1>
                                </th>
                                <td align="left">
                                    <p class="my-0 mx-3 fs-4">Componha um mail com o assunto "Recuperação de Password" e o mail da sua conta </p>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h1>3. </h1>
                                </th>
                                <td align="left">
                                    <p class="my-0 mx-3 fs-4">Envie o mail para "alberto@dripDropAdmin.com" e aguarde pela nossa resposta! 🕒</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
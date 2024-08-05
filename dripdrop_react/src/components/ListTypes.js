import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken, removeUserId, removeRole } from "../redux/actions";
import logo from '../images/dripdropdigital.png';

// View to list all the types
export default function ListTypes() {
  // initializes the types state
  const [types, setTypes] = useState([]);

  // gets the user ID from local storage
  const userId = localStorage.getItem("userId");

  // gets the navigate function from the router
  const navigate = useNavigate();

  // gets the dispatch function from the redux store
  const dispatch = useDispatch();

  // gets the token from the redux store
  const token = useSelector((state) => state.auth.token);

  // gets the types data from the API when the page loads
  useEffect(() => {
    getTypes();
  }, []);

  /**
   * Function to get the types data from the API
   *
   */
  function getTypes() {
    // gets the token from local storage and sets it in the headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // gets the types data from the API
    axios
      .get(`https://dripdrop.danielgraca.com/PHP-API/types`, config)
      .then(function (response) {
        console.log(response.data);
        setTypes(response.data);
      })
      .catch(function (error) {
        console.log(error);
        // ends the session if the token is invalid
        // Remove the token from the redux store and local storage
        dispatch(removeToken());
        localStorage.removeItem("token");

        // Remove the user id from the redux store and local storage
        dispatch(removeUserId());
        localStorage.removeItem("userId");

        // Remove the role from the redux store and local storage
        dispatch(removeRole());
        localStorage.removeItem("role");

        // navigates to the login page if the user is not authenticated
        navigate("/login");
        alert("Sessão expirada. Por favor faça login novamente.");
      });
  }

  /**
   * Function to delete a type
   * 
   * @param {*} id 
   * @returns 
   */
  function deleteType(id) {
    // gets the token from local storage and sets it in the headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // sends a DELETE request to the server
    axios
      .delete(`https://dripdrop.danielgraca.com/PHP-API/type/${id}`, config)
      .then(function (response) {
        console.log(response.data);
        getTypes();
      })
      .catch(function (error) {
        console.log(error);
        alert("Erro ao apagar o tipo. Por favor tente novamente.");
      });
  }

  return (
    <div className="container">
      <img src={logo} alt='DripDrop' style={{width: '220px'}} />
      <br/>
      <div className="w-100" >
        <button className='buttonBlue position-relative top-50 start-50 float-right fs-4 text-center pb-2' style={{ width:"40px", height:"40px"}} onClick={() => navigate("/type/create")}>+</button>
      </div>
      <div className=" w-100 whiteFullCard" style={{backgroundColor: "#212529"}}>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td>{type.name}</td>
              <td>
                <a href={`/type/${type.id}/details`} class="btn btn-info">
                  Detalhes
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    );
}
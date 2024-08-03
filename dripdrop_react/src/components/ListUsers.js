import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeToken, removeUserId } from "../redux/actions";
import logo from '../images/dripdropdigital.png';

// View to list all the users
export default function ListUsers() {
  // initializes the users state
  const [users, setUsers] = useState([]);

  // gets the user ID from local storage
  const userId = localStorage.getItem("userId");

  // gets the navigate function from the router
  const navigate = useNavigate();

  // gets the dispatch function from the redux store
  const dispatch = useDispatch();

  // gets the token from the redux store
  const token = useSelector((state) => state.auth.token);

  // gets the users data from the API when the page loads
  useEffect(() => {
    getUsers();
  }, []);

  /**
   * Function to get the users data from the API
   *
   */
  function getUsers() {
    // gets the token from local storage and sets it in the headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // gets the users data from the API
    axios
      .get(`https://dripdrop.danielgraca.com/PHP-API/users`, config)
      .then(function (response) {
        console.log(response.data);
        setUsers(response.data);
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
        // navigates to the login page if the user is not authenticated
        navigate("/login");
        alert("Sessão expirada. Por favor faça login novamente.");
      });
  }

  /**
   * Function to navigate to a path
   *
   * @param {string} path
   */
  function navigateTo(path) {
    navigate(path);
  }

  return (
    <div class="container">
      <img src={logo} alt='DripDrop' style={{width: '220px'}} />
      <br/>
      <div class="w-100" >
        <button class='buttonBlue position-relative top-50 start-50 float-right fs-4 text-center pb-2' style={{ width:"40px", height:"40px"}} onClick={() => navigate("/user/create")}>+</button>
      </div>
      <div class=" w-100 whiteFullCard" style={{backgroundColor: "#212529"}}>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <Link class="btn btn-info" to={`/user/${user.id}/details`}>Detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
}
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeToken, removeUserId, removeRole } from "../redux/actions";
import logo from '../images/dripdropdigital.png';

// View to list all the users
export default function ListUsers() {
  // initializes the users state
  const [users, setUsers] = useState([]);

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

        // Remove the role from the redux store and local storage
        dispatch(removeRole());
        localStorage.removeItem("role");

        // navigates to the login page if the user is not authenticated
        navigate("/login");
        alert("Sessão expirada. Por favor faça login novamente.");
      });
  }

  /**
   * Function to search for a user
   * 
   * @returns {void}
   */
  function search() {
    // gets the input element
    let input = document.getElementById("emailSearch");

    // gets the filter value
    let filter = input.value.toUpperCase();

    // gets the table rows
    let rows = document.querySelector("tbody").rows;

    // loops through the table rows
    for (let i = 0; i < rows.length; i++) {
      // gets the table data
      let td = rows[i].cells[1];

      // gets the text content
      let txtValue = td.textContent || td.innerText;

      // checks if the text content includes the filter value
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        // shows the row
        rows[i].style.display = "";
      } else {
        // hides the row
        rows[i].style.display = "none";
      }
    }
  }


  return (
    <div class="container">
      <img src={logo} alt='DripDrop' style={{width: '220px'}} />
      <br/>
      <div class="w-100" >
        <button class='buttonBlue position-relative top-50 start-50 float-right fs-4 text-center pb-2' style={{ width:"40px", height:"40px"}} onClick={() => navigate("/user/create")}>+</button>
      </div>
      <div class=" w-100 whiteFullCard" style={{backgroundColor: "#212529"}}>
        <div class="input-group rounded">
          <input id="emailSearch" type="search" class="form-control rounded" placeholder="Email" aria-label="Search" aria-describedby="search-addon" />
          <a class="btn btn-outline-info" onClick={() => search()}>Procurar</a>
        </div>
        <br/>
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
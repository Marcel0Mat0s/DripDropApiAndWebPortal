import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser'
import LoginUser from './components/LoginUser';
import ListPlants from './components/ListPlants';
import CreatePlant from './components/CreatePlant';
import EditPlant from './components/EditPlant';
import ListStates from './components/ListStates';
import ListNewPlantID from './components/ListNewPlantID';
import Info from './components/Info';
import About from './components/About';
import ListAllStates from './components/ListGraphs';
import ListUsers from './components/ListUsers';
import ListTypes from './components/ListTypes';
import EditType from './components/EditType';
import CreateType from './components/CreateType';
import DetailsUser from './components/DetailsUser';
import DetailsType from './components/DetailsType';
import ListUserPlants from './components/ListUserPlants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { removeToken, removeUserId, removeRole } from './redux/actions';
import CreateUserPlant from './components/CreateUserPlant';
import UserForgotPass from './components/UserForgotPass';
import ListDevices from './components/ListDevices';
import CreateDevice from './components/CreateDevice';
import EditDevice from './components/EditDevice';
import DetailsDevice from './components/DetailsDevice';

// Main component
function App() {

  const token = useSelector((state) => state.auth.token);
  const userid = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);

  const dispatch = useDispatch();

  useEffect(() => {
    const plantsViewButton = document.getElementById('plantsView');
    const defViewButton = document.getElementById('defView');
    const sessionButton = document.getElementById('sessionButton');
    const devices = document.getElementById('devicesView');

    if (!token) {
      try {
        if (plantsViewButton) {
          plantsViewButton.classList.add('disabled');
          plantsViewButton.classList.add('invisible');
        }
        if (defViewButton) {
          defViewButton.classList.add('disabled');
          defViewButton.classList.add('invisible');
        }
        if (devices) {
          devices.classList.add('disabled');
          devices.classList.add('invisible');
        }
        // Change the session button to login button that when clicked calls the login function
        if (sessionButton) {
          sessionButton.innerHTML = 'Iniciar Sessão';
          sessionButton.href = '/login';
          sessionButton.onclick = null;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        if (plantsViewButton) {
          plantsViewButton.classList.remove('disabled');
          plantsViewButton.classList.remove('invisible');
        }
        if (defViewButton) {
          defViewButton.classList.remove('disabled');
          defViewButton.classList.remove('invisible');
        }
        if (devices) {
          devices.classList.remove('disabled');
          devices.classList.remove('invisible');
        }
        // Change the session button to logout button that when clicked calls the logout function
        if (sessionButton) {
          sessionButton.innerHTML = 'Terminar Sessão';
          sessionButton.href = '/login';
          sessionButton.onclick = logout;
        }
      } catch (e) {
        console.log(e);
      } 
    }
  }, [token]);

  /**
     * Function to logout the user
     * 
     */
  const logout = () => {

    // Remove the token from the redux store and local storage
    dispatch(removeToken());
    localStorage.removeItem('token');

    // Remove the user id from the redux store and local storage
    dispatch(removeUserId());
    localStorage.removeItem('userId');

    // remove the role from the redux store and local storage
    dispatch(removeRole());
    localStorage.removeItem('role');

    console.log('Logged out');
  }

  // Private route component to check if the user is logged in and has the role of admin
  const PrivateRoute = ({ element, ...rest }) => {
    const role = useSelector((state) => state.auth.role);
    return role === 'admin' ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">

            <a class="navbar-brand" aria-current="page" href="/">DripDropDigital</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                <li class="nav-item">
                  <a class="nav-link" href="/about">Sobre</a>
                </li>

                <li class="nav-item">
                  <a class="nav-link" href="/info">Tutorial</a>
                </li>

                {token ?
                  <>
                  <li class="nav-item">
                  <a id="plantsView" class="nav-link disabled invisible" aria-disabled="true" href="/plants">Plantações</a>
                  </li>

                  <li class="nav-item">
                    <a id='devicesView' class="nav-link disabled invisible" href="/devices">Dispositivos</a>
                  </li>
                  </>
                  : null
                }

                {role === 'admin' ? 
                  <>
                  <li class="nav-item">
                    <a class="nav-link" href="/users">Clientes</a>
                  </li>
                  
                  <li class="nav-item">
                    <a class="nav-link" href="/types">Tipos de Plantas</a>
                  </li>
                  </>
                  : null
                }

                {token ?
                  <>
                  <li class="nav-item">
                    <a id="defView" class="nav-link disabled invisible" aria-disabled="true" href={`/user/${userid}/edit`} >Definições</a>
                  </li>
                  </>
                  : null
                }
                
              </ul>

              <a id="sessionButton" class="nav-link d-flex" href="/login">Iniciar Sessão</a>
            
            </div>
          </div>
        </nav>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="user/create" element={<CreateUser/>} />
          <Route path="user/:id/edit" element={<EditUser/>} />
          <Route path="login" element={<LoginUser/>} />
          <Route path="plants" element={<ListPlants/>} />
          <Route path="plant/create" element={<CreatePlant/>} />
          <Route path="plant/:id/edit" element={<EditPlant/>} />
          <Route path="states/:plantId/:plantType/:plantName" element={<ListStates/>} />
          <Route path="plant" element={<ListNewPlantID/>} />
          <Route path="info" element={<Info/>} />
          <Route path="about" element={<About/>} />
          <Route path="states/all/:plantId/:plantType/:plantName" element={<ListAllStates/>} />
          <Route path="devices" element={<ListDevices />} />
          <Route path="device/add" element={<CreateDevice />} />
          <Route path="device/:id/edit" element={<EditDevice />} />
          <Route path="device/:id/details" element={<DetailsDevice />} />
          <Route path="user/forgot" element={<UserForgotPass />} />
          <Route path="users" element={<PrivateRoute element={<ListUsers />} />} />
          <Route path="types" element={<PrivateRoute element={<ListTypes />} />} />
          <Route path="type/:id/edit" element={<PrivateRoute element={<EditType />} />} />
          <Route path="type/create" element={<PrivateRoute element={<CreateType />} />} />
          <Route path="user/:id/details" element={<PrivateRoute element={<DetailsUser />} />} />
          <Route path="type/:id/details" element={<PrivateRoute element={<DetailsType />} />} />
          <Route path="user/:id/plants" element={<PrivateRoute element={<ListUserPlants />} />} />
          <Route path="user/:id/plants/create" element={<PrivateRoute element={<CreateUserPlant />} />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

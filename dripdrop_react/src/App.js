import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser'
import LoginUser from './components/LoginUser';
import ListPlants from './components/ListPlants';
import CreatePlant from './components/CreatePlant';
import Main from './components/Main';
import EditPlant from './components/EditPlant';
import ListStates from './components/ListStates';
import ListNewPlantID from './components/ListNewPlantID';
import Info from './components/Info';
import About from './components/About';
import ListAllStates from './components/ListAllStates';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToken, removeUserId } from './redux/actions';

// Main component
function App() {

  const token = useSelector((state) => state.auth.token);
  const userid = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    const plantsViewButton = document.getElementById('plantsView');
    const defViewButton = document.getElementById('defView');
    const sessionButton = document.getElementById('sessionButton');

    if (!token) {
    } else {
      try {
        if (plantsViewButton) {
          plantsViewButton.classList.remove('disabled');
        }
        if (defViewButton) {
          defViewButton.classList.remove('disabled');
          defViewButton.classList.remove('invisible');
        }
        // Change the session button to logout button that when clicked calls the logout function
        if (sessionButton) {
          sessionButton.innerHTML = 'Terminar Sessão';
          sessionButton.href = '/login';
          sessionButton.onclick = logout;
        }
        // starts a session timeout of 60 minutes
        setTimeout(() => {
          logout();
        }, 3600000);
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

    console.log('Logged out');
  }

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

                <li class="nav-item">
                  <a id="plantsView" class="nav-link disabled" aria-disabled="true" href="/plants">Plantas</a>
                </li>

                <li class="nav-item">
                  <a id="defView" class="nav-link disabled invisible" aria-disabled="true" href={`/user/${userid}/edit`} >Definições</a>
                </li>
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
          <Route path="main" element={<Main/>} />
          <Route path="plants" element={<ListPlants/>} />
          <Route path="plant/create" element={<CreatePlant/>} />
          <Route path="plant/:id/edit" element={<EditPlant/>} />
          <Route path="states/:plantId/:plantType/:plantName" element={<ListStates/>} />
          <Route path="plant" element={<ListNewPlantID/>} />
          <Route path="info" element={<Info/>} />
          <Route path="about" element={<About/>} />
          <Route path="states/all/:plantId/:plantType" element={<ListAllStates/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

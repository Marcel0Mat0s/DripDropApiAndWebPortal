import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser'
import LoginUser from './components/LoginUser';
import ListPlants from './components/ListPlants';
import CreatePlant from './components/CreatePlant';
import Main from './components/Main';
import logo from './images/dripdropdigital.png';
import EditPlant from './components/EditPlant';
import ListStates from './components/ListStates';
import ListNewPlantID from './components/ListNewPlantID';
import Info from './components/Info';
import About from './components/About';
import ListAllStates from './components/ListAllStates';


// Main component
function App() {

  // Function to navigate to a path
  function navigateTo(path){
    return function(){
      window.location.href = path;
    } 
  }

  return (
    
    <div className="App">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">

          <a class="navbar-brand" aria-current="page" href="/">Drip Drop Digital</a>

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
                <a class="nav-link disabled" aria-disabled="true">Plantas</a>
              </li>
            </ul>

            <a class="nav-link d-flex" href="/login">Iniciar Sessão</a>
           
          </div>
        </div>
      </nav>
      <br/>
      <BrowserRouter>
        <nav>
          <ul>
          </ul>
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
          <Route path="states/all/:plantId" element={<ListAllStates/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

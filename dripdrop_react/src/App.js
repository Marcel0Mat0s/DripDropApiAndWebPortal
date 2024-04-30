import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import ListUser from './components/ListUser';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser'
import LoginUser from './components/LoginUser';
import ListPlants from './components/ListPlants';
import CreatePlant from './components/CreatePlant';
import Main from './components/Main';
import logo from './images/dripdropdigital.png';
import EditPlant from './components/EditPlant';
import ListStates from './components/ListStates';

function App() {
  return (
    <div className="App">
      <body>
        <div class="header">
          <a href="/login">Login</a>
          <a href="/user/create">Create User</a>
        </div>
          <br/>
          <img src={logo} alt="Logotipo DripDrop" class="logo"/>
      </body>

      <BrowserRouter>
        <nav>
          <ul>
          </ul>
        </nav>
        <Routes>
          <Route index element={<ListUser/>} />
          <Route path="user/create" element={<CreateUser/>} />
          <Route path="user/:id/edit" element={<EditUser/>} />
          <Route path="login" element={<LoginUser/>} />
          <Route path="main" element={<Main/>} />
          <Route path="plants" element={<ListPlants/>} />
          <Route path="plant/create" element={<CreatePlant/>} />
          <Route path="plant/:id/edit" element={<EditPlant/>} />
          <Route path="states/:plantId" element={<ListStates/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

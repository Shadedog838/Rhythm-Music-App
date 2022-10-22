// import logo from './logo.svg';
import './App.css';
import Start from './Components/Pages/Start';
import Home from './Components/Pages/Home';
import { ThemeContext, themes } from './Theme';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';

function App() {
  return (
    <ThemeContext.Provider  value={themes.dark}>
      <>
      <Router>
          <Routes>
            <Route exact path='/' element={<Start />} />
            <Route path='/home' element={<Home />} />
            <Route path='/home/search' element={<Home />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
          </Routes>
        </Router>
      </>
    </ThemeContext.Provider>
  );
}

export default App;

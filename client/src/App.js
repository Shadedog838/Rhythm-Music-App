// import logo from './logo.svg';
import './App.css';
import Start from './Components/Pages/Start';
import Home from './Components/Pages/Home';
import { ThemeContext, themes } from './Theme';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Components/Pages/Login';

function App() {
  return (
    <ThemeContext.Provider  value={themes.light}>
      <>
      <Router>
          <Routes>
            <Route exact path='/' element={<Start />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        </Router>
      </>
    </ThemeContext.Provider>
  );
}

export default App;

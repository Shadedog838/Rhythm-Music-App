// import logo from './logo.svg';
import './App.css';
import Start from './Components/Pages/Start';
import Home from './Components/Pages/Home';
import { ThemeContext, themes } from './Theme';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <ThemeContext.Provider  value={themes.light}>
      <>
      <Router>
          <Routes>
            <Route exact path='/' element={<Start />} />
            <Route exact path='/home' element={<Home />} />
          </Routes>
        </Router>
      </>
    </ThemeContext.Provider>
  );
}

export default App;

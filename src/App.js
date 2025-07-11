import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/register.jsx';
import Login from './pages/Login/login.jsx';
import Home from './pages/Home/home.jsx';
import ExpertServices  from './pages/ExpertServices/expertServices.jsx';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />  
        <Route path="/expert/:expertId" element={<ExpertServices />} />      
      </Routes>
    </Router>
  );
}

export default App;
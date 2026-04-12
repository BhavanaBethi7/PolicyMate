import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Landing from './components/landing';
import Home from './components/Home';
import Profile from './components/Profile';
import Eligibility from './components/eligibility';
import Check from './components/check';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/check" element={<Check />} />
      </Routes>
    </Router>
  );
}

export default App;
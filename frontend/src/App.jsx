import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Landing from './components/landing';
import Home from './components/Home';
import Profile from './components/Profile';
import Eligibility from './components/Eligibility';
import Check from './components/Check';
import AdminDashboard from './components/AdminDashboard';

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
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
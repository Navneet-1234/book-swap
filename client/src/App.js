import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBooks from './pages/MyBooks';
import Requests from './pages/Requests';
import './App.css';

// ProtectedRoute component to restrict access
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
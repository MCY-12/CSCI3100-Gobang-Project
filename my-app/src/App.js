import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import {useNavigate, Navigate} from 'react-router-dom';

import Login from './login';
import Homepage from './Homepage';
import CasualMatchmaking from './casual_matchmaking';
import RankedMatchmaking from './ranked_matchmaking';
import BoardPage from './board_page';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
    };
  
    window.onbeforeunload = handleBeforeUnload;
  
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');
    const userInfo = sessionStorage.getItem('userInfo');

    if (!token || !userInfo) {
        // User not authenticated; redirect to login page
        return <Navigate to="/login" />;
    }

    return children;
  };

  function HomeRoute ({setIsLoggedIn}) {
    const navigate = useNavigate();
    const tokenExists = sessionStorage.getItem('token');

    useEffect(() => {
      if (tokenExists) {
        navigate('/Homepage');
      }
    }, [navigate, tokenExists]);

    if (!tokenExists) {
      return <Login setIsLoggedIn={setIsLoggedIn} />;
    }
    
    return null;
  }

  return (
    <div className="App">
      <BrowserRouter>
        {<Homepage/>} {/*<-- Put the name of the page you want to frontend test there.*/}
        <Routes>
          <Route path="/Homepage" element={<ProtectedRoute><Homepage/></ProtectedRoute>} />
  {/* Only enable these after the pages are done, otherwise they will break the whole page
          <Route path="/casual_matchmaking" element={<ProtectedRoute><CasualMatchmaking/></ProtectedRoute>} />
          
          <Route path="/ranked_matchmaking" element={<ProtectedRoute><RankedMatchmaking/></ProtectedRoute>} />
          
          <Route path="/board_page" element={<ProtectedRoute><BoardPage/></ProtectedRoute>} />
  */}
          <Route path="/" element={<HomeRoute setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

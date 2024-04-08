import React from 'react';
import {Navbar, Container, Offcanvas} from 'react-bootstrap';
import {} from 'react-bootstrap-icons';

import { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function homepage() {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        let storedUserInfo = sessionStorage.getItem('userInfo');
    
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);
    
    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="">
            <Navbar>

            </Navbar>
            <Offcanvas>

            </Offcanvas>
            <Container fluid>

            </Container>
        </div>
    );
}

export default homepage;
import React from 'react';
import {Navbar, Nav, Container, Offcanvas, Button} from 'react-bootstrap';
import {FilePerson} from 'react-bootstrap-icons';

import { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Homepage() {
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

    const handleProfileShow = () => {
        
    }

    return (
        <div>
            <Navbar data-bs-theme="light" bg="dark">
                <Navbar.Brand className="ms-3" href='#'>GoGobang</Navbar.Brand>
                <Nav className="">
                    <Button className="me-2" variant="outline-danger" onClick={handleLogout}>Logout</Button>
                </Nav>
                <Nav className="">
                    <Button className="me-3" variant="outline-dark" onClick={handleProfileShow}>
                        <FilePerson size={24} />
                    </Button>
                </Nav>
            </Navbar>
        <Offcanvas>

        </Offcanvas>
        <Container fluid>

        </Container>
      </div>
    );
}

export default Homepage;
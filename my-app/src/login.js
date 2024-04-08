//login page (landing page)

import React from 'react';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (username, password) => {
        axios.post('http://localhost:3001/login', {username, password}).then(response => {
        setMessage(response.data.message);
            
            if (response.data.token) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('userInfo', JSON.stringify(response.data.user));
                
                setIsLoggedIn(true);

                navigate('/homepage');
            }
            else {
                setError(true);
            }
        })
        .catch(error => {
            setError(true);

            const errorMessage = error.response?.data?.message || error.message;
            setMessage("Error during login: " + errorMessage);
        });
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/register', { username, password });
            setMessage(response.data.message);
        } catch (err) {
            setError(true);
            setMessage("Error during registration: " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="">
            <Container fluid>

            </Container>
        </div>
    );
};

export default Login;
//login page (landing page)

import React from 'react';
import { useState } from 'react';
import { Container, Row, Form, Alert, Button} from 'react-bootstrap';
import { ArrowRight, ArrowUpLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        await axios.post('http://localhost:3000/login', { username, password }).then(response=>{
            if (response.data.token) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('userInfo', JSON.stringify(response.data.user));
                
                const successMsg=JSON.stringify(response.data.message);
            
                setError(false);
            
                setMessage(successMsg);
                
                setTimeout(()=>{
                    setIsLoggedIn(true);
                    navigate('/Homepage');},
                    3000);
            }
            
        })
        .catch (err=>{
        setError(true);
        const errMsg=JSON.stringify(err.response.data);
        setMessage("Error during login: " + errMsg);})
    
    };

    const handleRegister = async () => {
            await axios.post('http://localhost:3000/register', { username, password }).then(response=>{
                const successMsg=JSON.stringify(response.data);
                setError(false);
                setMessage(successMsg);
            })
            .catch (err=>{
            setError(true);
            const errMsg=JSON.stringify(err.response.data);
            setMessage("Error during registration: " + errMsg);})
        
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
            <Container fluid>
                <Row>
                    <h1 className='text-center' style={{
                        fontSize: 75 + 'px', 
                        fontWeight: 'bold', 
                        marginBottom: 5, 
                        color: 'lightskyblue'
                    }}>GOBANG</h1>
                </Row>
                <hr style={{
                    color: 'lightskyblue', 
                    borderColor: 'lightskyblue', 
                    backgroundColor: 'lightskyblue',
                    height: 2,
                    marginTop: 0,
                    marginBottom: 30
                }}/>
                
                <Row>
                    <h1 className='text-center' style={{
                        fontSize: 45 + 'px', 
                        fontWeight: 'lighter', 
                        marginBottom: 15
                    }}>Login/Register</h1>
                </Row>
                <Row className='text-center justify-content-center' md={4}>
                    <Form>
                        
                        {/* Username input */}
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Control 
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{textAlign: "center"}}
                            />
                        </Form.Group>
                        <p></p>
                        {/* Password input */}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{textAlign: "center"}}
                            />
                        </Form.Group>
                        
                        <p></p>
                        <Button className="mx-1 mb-2" variant="outline-info" onClick={handleRegister}>
                            <ArrowUpLeft/> Register
                        </Button>
                        <Button className="mx-1 mb-2" variant="outline-info" onClick={handleLogin}>
                            Login <ArrowRight/>
                        </Button>
                    </Form>
                </Row>
                {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}

            </Container>
        </div>
    );
};

export default Login;
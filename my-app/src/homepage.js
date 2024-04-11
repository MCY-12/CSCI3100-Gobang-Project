import React from 'react';
import {Navbar, Nav, Container, Offcanvas, Button, Col, Row, Modal, Collapse} from 'react-bootstrap';
import {FilePerson, PersonFill, BookFill, PersonSquare, XCircleFill} from 'react-bootstrap-icons';

import { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import './Homepage.css';

function Homepage() {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        let storedUserInfo = sessionStorage.getItem('userInfo');
    
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    //console.log("userInfo: " + userInfo);
    
    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userInfo');
        navigate('/');
    };

    const goCasual = () => {
        navigate('/casual_matchmaking');
    };

    const goRanked = () => {
        navigate('/ranked_matchmaking');
    };

    //constants for profile offcanvas
    const [showProfile, setShowProfile] = useState(false);
    const handleProfileShow = () => setShowProfile(true);
    const handleProfileClose = () => setShowProfile(false);

    const [userScore, setUserScore] = useState(null);

    useEffect(() => {
        fetch(`/user/score?username=${userInfo.username}`)
        .then(response => response.json())
        .then(score => {
            setUserScore(score);
        })
        .catch(error => console.error('Error:', error));
    }, []);

    //constants for view game records modal
    const [modalShow, setModalShow] = useState(false);
    const [modalFullscreen, setModalFullscreen] = useState(true);
    //handle modal from fullscreen to nonfullscreen
    function handleModalShow(breakpoint) {
        setModalFullscreen(breakpoint);
        setModalShow(true);
    }

    const [openRecords, setOpenRecords] = useState(false);
    const [matchRecords, setMatchRecords] = useState([]);
    useEffect(() => {
        if (userInfo) {
            const username = userInfo;
            fetch(`/user/matches?username=${userInfo.username}`)
            .then(response => response.json())
            .then(matches => {
                setMatchRecords(matches);
                setOpenRecords(matches.map(() => false));
            })
            .catch(error => console.error('Error:', error));
        }
    })

    const toggleOpen = index => {
        const newOpenRecords = [...openRecords];
        newOpenRecords[index] = !newOpenRecords[index];
        setOpenRecords(newOpenRecords);
    };

    //friend management code:
    const unFriend = () => {
        //backend people todo
    };
    //generate a list of friends to output
    function generateFriendsList(friends) {
        let output = '';
        for(let i = 0; i < friends.length; i++) {
            output += `
                <Row className='mb-2'>
                    <Col sm={2}>
                        <PersonSquare size={48} style={{backgroundColor:"white"}}/>
                    </Col>
                    <Col sm={8}>
                        <Container fluid>
                            <h5 id="friendName" style={{marginTop: "0.1rem", marginBottom:0, fontWeight:500}}>${friends[i].name}</h5>
                        </Container>
                        <Container fluid>
                            <h5 id="friendElo" style={{fontWeight:400}}>${friends[i].elo}</h5>
                        </Container>
                    </Col>
                    <Col sm={2} className="d-flex align-items-center">
                        <Container fluid>
                            <XCircleFill size={24} onClick={() => unFriend(friends[i].id)} style={{marginBottom:"0.5rem"}}/>
                        </Container>
                    </Col>
                </Row>
            `;
        }
        return output;
    }

    return (
        <div className="Homepage">
            <Navbar data-bs-theme="light" style={{backgroundColor: "lightskyblue"}}>
                <Navbar.Brand className="ms-3 me-auto" style={{color: "white", fontWeight: 500}} href='#'>GoGobang</Navbar.Brand>
                <Nav className="">
                    <Button id="logoutButton" className="me-2" variant="outline-danger" onClick={handleLogout}>Logout</Button>
                </Nav>
                <Nav className="">
                    <Button className="me-3" variant="dark" onClick={handleProfileShow}>
                        <FilePerson size={24} />
                    </Button>
                </Nav>
            </Navbar>

            <Offcanvas show={showProfile} onHide={handleProfileClose} placement="end" style={{backgroundColor: "#f1f8fd", minWidth: "30rem"}}>
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Container fluid>
                        <Row className="my-2">
                            <Col sm={3}>
                                <Container style={{height: "100%", paddingLeft:0, paddingRight:"1.4rem"}}><PersonFill size={"3.8rem"} style={{backgroundColor: "lightskyblue", width: "105%"}}/></Container>
                            </Col>
                            <Col sm={9}>
                                <h1 className="d-flex justify-content-flex-start align-items-center pb-1" style={{height: "100%"}} id="profileUsername" >{userInfo}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5 id="profileEloRating" className='me-auto' style={{marginTop: "0.6rem", fontWeight:450}}>Elo Rating: {userScore}</h5>
                            </Col>
                            <Col>
                                <Button id="profileViewGameRecordsButton" variant="info" onClick={() => handleModalShow('lg-down')}><BookFill size={"1.2rem"}/> View Game Records</Button>
                            </Col>
                        </Row>
                        <hr style={{
                            height: 2,
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        }}/>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>

            <Modal show={modalShow} fullscreen={modalFullscreen} onHide={() => setModalShow(false)} size="lg" centered>
                <Modal.Header closeButton className="py-2">
                    <Modal.Title id="viewGameRecordsTitle">Game Records</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid id="viewGameRecordsContainer">
                        {matchRecords.map((match, index) => (
                            <div key={index}>
                                <Button className="d-flex justify-content-center mt-3" onClick={() => toggleOpen(index)} variant="outline-info">
                                    <span style={{ whiteSpace: 'pre-line'}}>
                                        Starting Time: {match.startingTime} - {match.result}
                                        {'\n'} 
                                        {match.player1.username} vs {match.player2.username}
                                    </span>
                                </Button>
                                <Collapse in={openRecords[index]}>
                                    <div>
                                        Final Game State:
                                        {match.board.map((row, rowIndex) => (
                                            <div key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <span key={cellIndex}>{cell}</span>
                                            ))}
                                            </div>
                                        ))}
                                    </div>
                                </Collapse>
                            </div>
                        ))}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-center align-items-center" style={{height: "85vh"}}>
                <Button id="casualButton" variant="outline-info" className="fs-1" onClick={goCasual}>Casual</Button>
                <Button id="rankedButton" variant="outline-info" className="fs-1" onClick={goRanked}>Ranked</Button>
            </div>
        </div>
    );
}

export default Homepage;
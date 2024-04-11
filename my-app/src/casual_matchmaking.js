import React from "react";
import { Container, Col, Button, Row, Modal, InputGroup, FormControl} from 'react-bootstrap';
import { PersonCircle, QuestionLg, QuestionCircle, Search, People, PeopleFill, XLg} from 'react-bootstrap-icons';

import {useState, useEffect} from 'react';

import {useNavigate} from 'react-router-dom';

import './casual_matchmaking.css';

function CasualMatchmaking() { 
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        let storedUserInfo = sessionStorage.getItem('userInfo');
    
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const navigate = useNavigate();

    //constants for timer control
    const [isSearching, setIsSearching] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    useEffect(() => {
        let interval;
        if (isSearching) {
            interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSearching]);
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    //handle the search button being clicked.
    const handleSearchClick = () => {
        setIsSearching(true);
    };
    const handleCancelClick = () => {
        setIsSearching(false);
        setElapsedTime(0);
    };
    
    //handle the invite friend button being clicked and the modal from it
    const [showModal, setShowModal] = useState(false);
    const handleInviteClick = () => {
        setShowModal(true);
    };

    //handle what happens after match is found
    const [matchFound, setMatchFound] = useState(false);
        //backend people insert matchmaking logic function here (probably using useEffect)
        //MAKE IT SO THAT ONCE A MATCH IS FOUND isSearching IS SET TO FALSE AND matchFound IS SET TO TRUE
        //setMatchFound(true);
        //setIsSearching(false);
        //the frontend code relies on this
        //also remember to remove all the test user names and link to back-end

    return (
        <div className="CasualMatchmaking d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
            <Container fluid>
                <Row>
                    <Col sm={2}></Col>
                    <Col sm={3}>
                        <Row>
                            <PersonCircle className="mb-2" size={"3.3rem"}/>
                        </Row>
                        <Row>
                            <h5 className="fw-light">{userInfo && userInfo.username}</h5>
                        </Row>
                    </Col>
                    <Col sm={2} className="d-flex align-items-center justify-content-center fs-1 fw-bold pb-2">
                        vs
                    </Col>
                    <Col sm={3}>
                        <Row>
                            {matchFound ? <PersonCircle className="mb-2" size={"3.3rem"}/> : <QuestionCircle className="mb-2" size={"3.3rem"}/>}
                        </Row>
                        <Row>
                            <h5 className="fw-light">{matchFound ? 'testUser312' : '. . .'}</h5>
                        </Row>
                    </Col>
                    <Col sm={2}></Col>
                </Row>
                <Row className="">
                    <Container>
                        {isSearching && !matchFound ? formatTime(elapsedTime) : null}
                        {matchFound ? <h2>Match Found</h2> : null}
                    </Container>
                    <Container className="mt-2 mb-2">
                    {isSearching && !matchFound ? (
                            <Button id="casualCancelButton" variant="outline-danger" onClick={handleCancelClick}>
                                <XLg className="pb-1" size={"2.2rem"}/> Cancel
                            </Button>
                        ) : (
                            <Button id="casualSearchButton" variant="outline-info" onClick={handleSearchClick}>
                                <Search className="pb-1" size={"2.2rem"}/> Search
                            </Button>
                        )}
                    </Container>
                </Row>

                <Row>
                    <Container className="mt-2 mb-2">
                        {!isSearching && !matchFound ? (
                            <Button id="casualInviteFriendButton" variant="outline-info" onClick={handleInviteClick} active={showModal}>
                                <PeopleFill className="pb-1" size={"2.2rem"}/> Invite Friend
                            </Button>
                        ) : null}
                    </Container>
                </Row>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite a Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text><Search/></InputGroup.Text>
                        <FormControl placeholder="Search"/>
                    </InputGroup>
                    {/* Backend people link this with backend. Turn this into loop that output a friend for every friend in userInfo */}
                    {/* Also need to link search filter to filter through friends. If no time then just delete the search bar*/}
                    <p>Friend 1</p>
                    <p>Friend 2</p>
                    <p>Friend 3</p>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CasualMatchmaking;
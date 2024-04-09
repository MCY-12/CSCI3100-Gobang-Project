import React from "react";
import {} from 'react-bootstrap';
import {} from 'react-bootstrap-icons';

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

    return (
        <div className="CasualMatchmaking">
            <p>Hi</p>
        </div>
    );
}

export default CasualMatchmaking;
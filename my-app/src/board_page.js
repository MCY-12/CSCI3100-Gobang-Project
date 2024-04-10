import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './board_page.css';





function Board_page(){
let timer1;
let timer2;
const startingMin = 10;
let time1 = startingMin*60;
let time2 = startingMin*60;
const timerOne = document.getElementById("timer1");
const timerTwo = document.getElementById("timer2");
function updateCount1(){
    time1--;
    const min = Math.floor(time1/60);
    let sec = time1 %60;
    sec = sec<10? '0'+sec:sec;
    timerOne.textContent = `${min}:${sec}`;
    if(time1 === 0){
        gobangGame.gobang.onclick = null
        gobangGame.win = true
        document.getElementById("Move").textContent = "Player 2 wins";
        stop1();
        stop();
    }
    else if(time2 === 0){
        gobangGame.gobang.onclick = null
        gobangGame.win = true
        document.getElementById("Move").textContent = "Player 1 wins";
        stop2();
        stop();
    }
}
function updateCount2(){
    time2--;
    const min = Math.floor(time2/60);
    let sec = time2 %60;
    sec = sec<10? '0'+sec:sec;
    timerTwo.textContent = `${min}:${sec}`;
    if(time1 === 0){
        gobangGame.gobang.onclick = null
        gobangGame.win = true
        document.getElementById("Move").textContent = "Player 2 wins";
        stop1();
        stop();
    }
    else if(time2 === 0){
        gobangGame.gobang.onclick = null
        gobangGame.win = true
        document.getElementById("Move").textContent = "Player 1 wins";
        stop2();
        stop();
    }
}

function stop1(){
    clearInterval(timer1);
}
function start1(){
    let timer1 = setInterval(updateCount1, 1000);
}
function stop2(){
    clearInterval(timer2);
}
function start2(){
    let timer2 = setInterval(updateCount2, 1000);
}
const clockDisplay = document.getElementById("clock");
const startTime = Date.now();
function update(){
    const currentTime = Date.now();
    let elapsedTime = currentTime-startTime;
    let min = Math.floor(elapsedTime/(1000*60)%60);
    let sec = Math.floor(elapsedTime/1000%60);
    min = String(min).padStart(2, "0");
    sec = String(sec).padStart(2, "0");
    clockDisplay.textContent = `${min}:${sec}`;
}
function stop(){
    clearInterval(clock);
}
let clock = setInterval(update, 1000);

            
        class Gobang { 
            constructor(options) {
                this.options = options
                this.resetAndInit()
            }

            resetAndInit() { 
                const { options } = this
                this.role = 1
                this.win = false
                this.history = []
                this.currentStep = 0
                this.gobang = null
                this.gobang = document.getElementById(options.canvas || 'gobang')
                this.context = this.gobang.getContext('2d')
                this.context.strokeStyle = '#aaa'
                this.context.lineWidth = 1
                this.gobang.onclick = null
                this.context.fillStyle = '#ddd'
                this.context.beginPath()
                this.context.fillRect(0, 0, this.gobang.clientWidth, this.gobang.clientHeight)
                this.context.closePath()
                this.gobangStyle = Object.assign(options.gobangStyle)
    
                this.lattice = {
                    width: (this.gobang.clientWidth - this.gobangStyle.padding * 2) / this.gobangStyle.count,
                    height: (this.gobang.clientHeight - this.gobangStyle.padding * 2) / this.gobangStyle.count
                }
                this.drawChessboard()
                this.listenDownChessman()
                this.initChessboardMatrix()
                start1();
            }
    
            initChessboardMatrix() {
                const checkerboard = []
                for (let x = 0; x < this.gobangStyle.count + 1; x++) {
                    checkerboard[x] = []
                    for (let y = 0; y < this.gobangStyle.count + 1; y++) {
                        checkerboard[x][y] = 0
                    }
                }
                this.checkerboard = checkerboard
            }
    
            drawChessboard() {
                const { gobangStyle, context, lattice, gobang } = this
                for (let i = 0; i <= gobangStyle.count; i++) {
                    context.moveTo(gobangStyle.padding + i * lattice.width, gobangStyle.padding)
                    context.lineTo(gobangStyle.padding + i * lattice.width, gobang.clientWidth - gobangStyle.padding)
                    context.stroke()
                    context.moveTo(gobangStyle.padding, gobangStyle.padding + i * lattice.height)
                    context.lineTo(gobang.clientHeight - gobangStyle.padding, gobangStyle.padding + i * lattice.height)
                    context.stroke()
                }
                context.fillStyle = '#000'
                ;[{				x: gobang.clientWidth / 2,				y: gobang.clientHeight / 2			}, {				x: gobangStyle.padding + 4 * lattice.width, 				y: gobangStyle.padding + 4 * lattice.height			}, {				x: gobangStyle.padding + (gobangStyle.count - 4) * lattice.width,				y: gobangStyle.padding + 4 * lattice.height			}, {				x: gobangStyle.padding + 4 * lattice.width, 				y: gobangStyle.padding + (gobangStyle.count - 4) * lattice.height			}, {				x: gobangStyle.padding + (gobangStyle.count - 4) * lattice.width,				y: gobangStyle.padding + (gobangStyle.count - 4) * lattice.height			}].forEach(sign => {
                    context.beginPath()
                    context.arc(sign.x, sign.y, lattice.width * 0.1, 0, 2 * Math.PI)
                    context.closePath()
                    context.fill()
                })
            }

            drawChessman(x, y, isBlack) {
                const { gobangStyle, context, lattice, gobang } = this
                context.fillStyle = isBlack ? '#000' : '#fff'
                context.beginPath()
                context.arc(
                    gobangStyle.padding + x * lattice.width, 
                    gobangStyle.padding + y * lattice.height,
                    lattice.width * 0.4, 0, 2 * Math.PI
                )
                context.closePath()
                context.fill()
                setTimeout(() => {
                    this.checkReferee(x, y, isBlack ? 1 : 2)
                }, 0)
            }
    
            listenDownChessman(isBlack = false) {
                this.gobang.onclick = event => {
                    let { offsetX: x, offsetY: y } = event
                    x = Math.floor((x - this.gobangStyle.padding / 2) / this.lattice.width)
                    y = Math.floor((y - this.gobangStyle.padding / 2) / this.lattice.height)
    
                    const effectiveBoard = !!this.checkerboard[x]
                    if (effectiveBoard && 
                            this.checkerboard[x][y] !== undefined && 
                            Object.is(this.checkerboard[x][y], 0)) {
    
                        this.checkerboard[x][y] = this.role
                        this.drawChessman(x, y, Object.is(this.role, 1))

                        const myDiv = document.getElementById("moveHistory");
                        const newParagraph = document.createElement("p");
                        newParagraph.textContent = Object.is(this.role, 1) ? `Black: ${x} , ${y}`: `White: ${x} , ${y}`;
                        myDiv.appendChild(newParagraph);
    
                        this.history.length = this.currentStep
                        this.history.push({ 
                            x, y, 
                            role: this.role, 
                            snap: this.context.getImageData(0, 0, this.gobang.clientWidth, this.gobang.clientHeight)
                        })

                        this.currentStep++
                        this.role = Object.is(this.role, 1) ? 2 : 1
                        let move = document.getElementById("Move");
                        move.textContent = Object.is(this.role, 1) ? "Black to Move" : "White to Move";
                        if(Object.is(this.role, 1)){
                            start1();
                            stop2();
                        }
                        else{
                            start2();
                            stop1();
                        }   
                    }
                }
            }
    
            checkReferee(x, y, role) {
                if ((x == undefined) || (y == undefined) || (role == undefined)) return

                let countContinuous = 0

                const XContinuous = this.checkerboard.map(x => x[y])
                const YContinuous = this.checkerboard[x]
                const S1Continuous = []
                const S2Continuous = []
    
                this.checkerboard.forEach((_y, i) => {

                    const S1Item = _y[y - (x - i)]
                    if (S1Item !== undefined) {
                        S1Continuous.push(S1Item)
                    }
                    const S2Item = _y[y + (x - i)]
                    if (S2Item !== undefined) {
                        S2Continuous.push(S2Item)
                    }
                })
                ;[XContinuous, YContinuous, S1Continuous, S2Continuous].forEach(axis => {
                    if (axis.some((x, i) => axis[i] !== 0 &&
                        axis[i-2] === axis[i-1] &&
                        axis[i-1] === axis[i] && 
                        axis[i] === axis[i+1] && 
                        axis[i+1] === axis[i+2])) {
                        countContinuous ++
                    }
                })

                if (countContinuous) {
                    this.gobang.onclick = null
                    this.win = true
                    stop1();
                    stop2();
                    stop();
                    document.getElementById("Move").textContent = role == 1? "Player 1 wins" : "PLayer 2 wins";
                }
            }

            regretChess() {
                if (this.history.length && !this.win) {
                    const prev = this.history[this.currentStep - 2]
                    const _prev = this.history[this.currentStep - 1]

                    if (prev && prev.snap) {
                        this.role = Object.is(this.role, 1) ? 2 : 1
                        let move = document.getElementById("Move");
                        move.textContent = Object.is(this.role, 1) ? "Black to Move" : "White to Move";

                        const myDiv = document.getElementById("moveHistory");
                        const lastParagraph = myDiv.lastElementChild;
                        lastParagraph.remove();

                        if(Object.is(this.role, 1)){
                            start1();
                            stop2();
                        }
                        else{
                            start2();
                            stop1();
                        }  
                        this.context.putImageData(prev.snap, 0, 0)
                        this.checkerboard[_prev.x][_prev.y] = 0
                        this.currentStep--
                    }
                    
                }
            }
            revokedRegretChess() {
                const next = this.history[this.currentStep]
                if (next && next.snap) {
                    this.role = Object.is(this.role, 1) ? 2 : 1
                    let move = document.getElementById("Move");
                    move.textContent = Object.is(this.role, 1) ? "Black to Move" : "White to Move";

                    const myDiv = document.getElementById("moveHistory");
                        const newParagraph = document.createElement("p");
                        newParagraph.textContent = Object.is(this.role, 1) ? `Black: ${next.x} , ${next.y}`: `White: ${next.x} , ${next.y}`;
                        myDiv.appendChild(newParagraph);

                    if(Object.is(this.role, 1)){
                        start1();
                        stop2();
                    }
                    else{
                        start2();
                        stop1();
                    }  
                    this.context.putImageData(next.snap, 0, 0)
                    this.checkerboard[next.x][next.y] = next.role
                    this.currentStep++
                }
            }
        }
        const gobangGame = new Gobang({
            role: 1,
            canvas: 'game',
            gobangStyle: {
                padding: 30,
                count: 18
            }
        })


        return (
 <div class="container">
    <div class="app">
      <canvas id="game" width="600px" height="600px"></canvas>
      <br/>
      <div class="tools">
        <button onclick="gobangGame.regretChess()">Retract</button>
        <button onclick="gobangGame.revokedRegretChess()">Undo</button>
      </div>
    </div>

    <div class="rightpart">
      <div class="turn-indicator" id="Move">Black to Move</div>
      <div class="clock" id="clock">00:00</div>

      <div class="info">
        <div class="user-timer">
          <div class="username">Player 1</div>
          <div class="timer" id="timer1">10:00</div>
        </div>
        <div class="user-timer">
          <div class="username">Player 2</div>
          <div class="timer" id="timer2">10:00</div>
        </div>
      </div>
      <button>Move</button>
      <div class="scrollable-window" id="moveHistory">
      </div>
    </div>

  </div>
        );
    
    }
       
    export default Board_page;
       

      
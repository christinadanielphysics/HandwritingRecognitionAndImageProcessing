import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { app } from './initialize.js';
import { createButtons } from './mathjax.js'
import { removeWorkingDirectory, updateCustomProjectName } from './files.js';
import { setProjectNamesArray } from './table.js';



// Authentication 

let auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user is signed in", user)
  } else {
    window.location.href = '/login'; // redirect
  }
});

document.getElementById("create-sign-out").addEventListener('click', async function() {

    signOut(getAuth()).then(() => {

    localStorage.setItem("projectNamesArray",JSON.stringify([]));
    localStorage.setItem("customNamesArray",JSON.stringify([]));
    localStorage.setItem("textAreaData", "");
    localStorage.setItem("mathjaxStatesData",JSON.stringify([]));
    localStorage.setItem("texStatesData",JSON.stringify([]));
    localStorage.setItem("projectName","");
    localStorage.setItem("customName","");


    console.log("sign out successful");

    }).catch((error) => {
        console.log("sign out error")
    });

    await removeWorkingDirectory();

    window.location.href = '/login';

});



// Navigation

document.getElementById("create-back").addEventListener('click', async function() {

    await setProjectNamesArray();  // custom project names may have changed

    localStorage.setItem("textAreaData", "");
    localStorage.setItem("mathjaxStatesData",JSON.stringify([]));
    localStorage.setItem("texStatesData",JSON.stringify([]));
    localStorage.setItem("projectName","");
    localStorage.setItem("customName","");


    window.location.href = '/documents';

});

// Custom Project Name

document.getElementById("create-settings").addEventListener('click', function() {

    updateCustomProjectName();

});

// Drawing

let isDrawing;
let x;
let y;
let penSize = 10;
const canvas = document.getElementById('canvas-draw');
const c = canvas.getContext("2d");
c.fillStyle = "black";
c.strokeStyle = c.fillStyle;


canvas.addEventListener("mousedown", (event)=> {
    isDrawing = true;
    x = event.offsetX;
    y = event.offsetY;
});

canvas.addEventListener("mousemove", (event)=> {
    draw(event.offsetX, event.offsetY);
});

canvas.addEventListener("mouseup", ()=> {
    isDrawing = false;
    x = undefined;
    y = undefined;
    getPredictionsAndFormButtons();
});

document.getElementById("clear-canvas-btn").addEventListener("click", function() {
    c.clearRect(0,0,canvas.width, canvas.height);

});

function draw(x2,y2) {
    if (isDrawing) {
        c.beginPath();
        c.arc(x2,y2,penSize,0,Math.PI * 2);
        c.closePath();
        c.fill();
        drawLine(x,y,x2,y2);
    }
    x = x2;
    y = y2;
}

function drawLine(x1,y1,x2,y2) {
    c.beginPath();
    c.moveTo(x1,y1); 
    c.lineTo(x2,y2);
    c.strokeStyle = c.fillStyle;
    c.lineWidth = penSize * 2; 
    c.stroke();
}

// Symbol Prediction

async function downloadDataURL_predicting() { 

    const dataURL = canvas.toDataURL('image/png');

    await fetch('/send_for_prediction_image', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ 
            imageData: dataURL
        })

    })
}

async function getPredictionsAndFormButtons() {

    await fetch('/remove_previous_image', {
        method: 'POST'
    }).then(res => {
        return res.json();
    });

    await downloadDataURL_predicting();

    const theResponse = await fetch('/predict_symbol', {
        method: 'POST'
    }).then(res => {
        return res.json();
    }).then(data => { // The second .then receivees the parsed JSON data from the first block
        createButtons(data);
    });
} 

export { c, canvas };


// Training

// TODO: COMMENT OUT THIS CODE WHEN TRAINING IS DONE 



// const trainButton = document.getElementById('button-train');
// trainButton.addEventListener('click', function() {
//     downloadDataURL_training();
//     c.clearRect(0,0,canvas.width, canvas.height);
// });

// function downloadDataURL_training() { 
//     const dataURL = canvas.toDataURL('image/png');
//     const link = document.createElement('a');
//     let now = new Date();
//     now_formatted = 'y' + now.getFullYear() + 'm' + (now.getMonth() + 1) + 'd' + now.getDate();
//     now_formatted = now_formatted + "h" + now.getHours() + 'm' + now.getMinutes() + 's' + now.getSeconds() + 'ms' + now.getMilliseconds();
//     link.download = "training-image_"+ now_formatted + ".png" 
//     link.href = dataURL;
//     link.dispatchEvent(new MouseEvent('click'));
// }


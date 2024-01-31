import { uploadUpdatedTexFile, uploadUpdatedPDFFile, removeWorkingDirectory, setWorkingDirectory } from './files.js'
import { reload_pdf } from './refresh.js';
import { save_pickled_tex_states, send_pickled_tex_states} from './load.js';
import { mathjax_dictionary } from './javascript_dictionary.js';
import { c, canvas } from './create.js';

// mathjax display

let mathjaxDisplay = document.getElementById("display-mathjax");
mathjaxDisplay.innerHTML = ``;


// arrays to keep track of symbols

let mathjaxStates = []; // for HTML for mathjaxDisplay
let texStates = []; // symbols for Tex PDF
// mathjaxStates.push(``);
// texStates.push("");


// buttons

let buttonOne = document.createElement('button');
let buttonTwo = document.createElement('button');
let buttonThree = document.createElement('button');
let buttonFour = document.createElement('button');
let buttonFive = document.createElement('button');
let buttonSix = document.createElement('button');





let symbolButtons = [];
defineButtons();

function defineButtons() {
    defineButton(buttonOne);
    defineButton(buttonTwo);
    defineButton(buttonThree);
    defineButton(buttonFour);
    defineButton(buttonFive);
    defineButton(buttonSix);
    symbolButtons.push(buttonOne);
    symbolButtons.push(buttonTwo);
    symbolButtons.push(buttonThree);
    symbolButtons.push(buttonFour);
    symbolButtons.push(buttonFive);
    symbolButtons.push(buttonSix);
}

function defineButton(buttonName) {
    buttonName.className = "btn";
    buttonName.type = "button";
    let aboveCanvas = document.getElementById("above-canvas");
    aboveCanvas.appendChild(buttonName);
    buttonName.style.display = "none"; // hide button
    buttonName.addEventListener('click', function() { // what happens when the button is pressed
        mathjaxDisplay.innerHTML = mathjaxDisplay.innerHTML + buttonName.innerHTML;
        MathJax.typeset();
        mathjaxStates.push(mathjaxDisplay.innerHTML);
        
        // store the folder names in texStates
        let currentState = "";
        if (texStates.length != 0) {
            currentState = texStates[texStates.length - 1] + buttonName.id + " "; // there is a space at the end for delimiting
        }
        console.log("this is the currentState", currentState);
        texStates.push(currentState);
        
    });
}

function hideButtons() {
    buttonOne.style.display = "none";
    buttonTwo.style.display = "none";
    buttonThree.style.display = "none";
    buttonFour.style.display = "none";
    buttonFive.style.display = "none";
    buttonSix.style.display = "none";
}

function createButtons(data) {
    hideButtons();
    for (let i = 0; i < data.length; i++) {
        symbolButtons[i].innerHTML = toInlineTex( mathjax_dictionary[data[i]] ); // setting the mathjax shown on the button
        symbolButtons[i].id = data[i]; // store the foldername, for button's event listener
        MathJax.typeset();
        symbolButtons[i].style.display = "inline"; // show button
    }
}

function toInlineTex(variable) {
    return `\\(${variable}\\)`;
}






// undo for mathjax display

let undoButton = document.getElementById("undo-btn");
undoButton.addEventListener('click', function() {
    if (mathjaxStates.length > 1) {
        mathjaxStates.pop();
        mathjaxDisplay.innerHTML = mathjaxStates[mathjaxStates.length-1];
        MathJax.typeset();
        texStates.pop();
    }
});


// clear for mathjax display

let clearButton = document.getElementById("mathjax-clear-btn");
clearButton.addEventListener('click', function() {
    mathjaxStates = [];
    mathjaxStates.push(``);
    mathjaxDisplay.innerHTML = ``;
    MathJax.typeset();
    texStates = [];
    texStates.push("");

    hideButtons();
    c.clearRect(0,0,canvas.width, canvas.height);
});

// send the Tex States from Javascript to Flask

document.getElementById("mathjax-add-btn").addEventListener('click', async function() {

    await sendTexState();

});

async function sendTexState() { // does not include text from text Area, texStates are just formatted differently from mathjaxStates

    let jsonTexState = JSON.stringify(texStates[texStates.length-1]); // get the last element as this is the final state of the mathjax display

    await fetch('/add_symbols_to_document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonTexState
    });

    await fetch('/update_pdf_for_display', {
        method: 'POST'
    });

    reload_pdf();

    await uploadUpdatedPDFFile();

    await fetch('/get_updated_tex_file', {
        method: 'POST'
    });

    await uploadUpdatedTexFile();

    await save_pickled_tex_states();

}

export { mathjaxDisplay, toInlineTex, mathjaxStates, texStates, createButtons, hideButtons };

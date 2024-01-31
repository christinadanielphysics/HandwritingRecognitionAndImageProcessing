import { mathjaxStates, texStates, mathjaxDisplay, toInlineTex } from './mathjax.js'
import { mathjax_dictionary } from './javascript_dictionary.js'

// Configure the pop-up behavior

let findButton = document.getElementById("find-btn");

let closeButton = document.getElementById("close-button");

let modal = document.getElementById("modal");

findButton.addEventListener('click', () => {
    openModal();
});

closeButton.addEventListener('click', () => {
    closeModal();
});

// window.onload = async function() {  await addButtonsToFindFeature(); };


async function openModal() {
    modal.classList.add('active');
}

async function closeModal() {
    modal.classList.remove('active');
}

// Add Buttons to the body of the pop-up

let modal_body = document.getElementById("modal-body");


async function addButtonsToFindFeature() {


    for (let key in mathjax_dictionary) {  

        let one_button = document.createElement("button"); // create a button
        one_button.type = "button"; // define the type for the button
        one_button.className = "btn-for-find-feature"; // define the class for the button
        modal_body.appendChild(one_button); // add the button to the pop-up
        one_button.innerHTML = toInlineTex( mathjax_dictionary[key] ); // set the mathjax for the button
        MathJax.typeset(); // render the mathjax that is displayed the button

        one_button.addEventListener('click', function() { // what happens when the button is pressed
            mathjaxDisplay.innerHTML = mathjaxDisplay.innerHTML + one_button.innerHTML; // add mathjax to the mathjax display
            MathJax.typeset(); // render the Tex on the mathjax display
            mathjaxStates.push(mathjaxDisplay.innerHTML); // keep track of innerHTML on mathjax display, for mathjax display
            
            // store the folder names in texStates
            let currentState = "";
            if (texStates.length != 0) { // avoiding potential out-of-bounds error
                currentState = texStates[texStates.length - 1] + key + " "; // there is a space at the end for delimiting
            }
            console.log("this is the currentState", currentState);
            texStates.push(currentState); // keep track of textContent on mathjax display, for full document
            
            // closeModal();
        });

    }
}

export { addButtonsToFindFeature };












import { mathjaxDisplay, toInlineTex, mathjaxStates, texStates } from './mathjax.js';
import { textArea } from './write.js';
import { addButtonsToFindFeature } from './find.js'
import { mathjax_dictionary } from './javascript_dictionary.js'

// Refreshing and Local Storage

window.onbeforeunload = function() {
    localStorage.setItem("textAreaData", textArea.value);
    localStorage.setItem("mathjaxStatesData",JSON.stringify(mathjaxStates));
    localStorage.setItem("texStatesData",JSON.stringify(texStates));
}
  
window.onload = async function() {

    let storedTextAreaData = localStorage.getItem("textAreaData"); 
    if(storedTextAreaData) {
      textArea.value = storedTextAreaData; 
    }

    
    let storedMathjaxStatesData = JSON.parse(localStorage.getItem("mathjaxStatesData"));
    if (storedMathjaxStatesData) {
        for (let i = 0; i < storedMathjaxStatesData.length; i++) {
            mathjaxStates.push(storedMathjaxStatesData[i]);
        }
    }
    else {
        mathjaxStates.push(``);
    }
   
    mathjaxDisplay.innerHTML = ``; 
    let storedTexStatesData = JSON.parse(localStorage.getItem("texStatesData"));
    if (storedTexStatesData) {
        for (let i = 0; i < storedTexStatesData.length; i++) {
            texStates.push(storedTexStatesData[i]);
        }

        // restore mathjax display based on folder names stored in texStates
        let storedMathjaxData = texStates[texStates.length - 1];

        let folders = [];
        let folder = "";
        for (let i = 0; i < storedMathjaxData.length; i++) {
            if (storedMathjaxData[i] != " ") { // there is a space between each folder name
                folder = folder + storedMathjaxData[i];
            }
            else {
                console.log("the folder name is", folder);
                if (folder != " ") {
                    folders.push(folder); // the last character is likely a space, but don't want this to be the name of a folder
                }
                folder = "";
            }
        }

        for (let i = 0; i < folders.length; i++) {
            mathjaxDisplay.innerHTML = mathjaxDisplay.innerHTML + toInlineTex( mathjax_dictionary[folders[i]] ); 
            MathJax.typeset();
        }

    }
    else {
        texStates.push("");
    }

    console.log("THESE ARE THE TEX STATES",texStates);


    await addButtonsToFindFeature();
    
}

// PDF Viewer

function reload_pdf() { // this function is just for the pdf that displays on the create.html page

    document.getElementById('pdf-viewer').contentDocument.location.reload(true);

}

export { reload_pdf };




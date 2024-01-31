import { uploadUpdatedTexFile, uploadUpdatedPDFFile, removeWorkingDirectory, setWorkingDirectory } from './files.js';
import { reload_pdf } from './refresh.js';
import { save_pickled_tex_states, send_pickled_tex_states } from './load.js'

// Write

let textArea = document.getElementById("text-area-for-typing");

let keyboardAddButton = document.getElementById("keyboard-add-btn");

keyboardAddButton.addEventListener('click', async function() {

    await sendCharacters();
});

async function sendCharacters() {

    let textState = textArea.value;


    await fetch('/add_text_to_document', {
        method: 'POST',
        body: textState
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

export { textArea };









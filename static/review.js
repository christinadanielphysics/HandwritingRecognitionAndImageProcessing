import { uploadUpdatedTexFile, uploadUpdatedPDFFile } from './files.js';
import { reload_pdf } from './refresh.js';
import {save_pickled_tex_states, send_pickled_tex_states} from './load.js'


// Undo

document.getElementById("output-undo").addEventListener('click', async function() {

    await fetch('/undo_for_review_section', {
        method: 'POST'
    });

    console.log("/undo_for_review_section completed")

    await fetch('/update_pdf_for_display', {
        method: 'POST'
    });

    console.log("/update_pdf_for_display completed")

    reload_pdf();

    console.log("reload_pdf() completed")

    await uploadUpdatedPDFFile();

    console.log("uploadUpdatedPDFFile completed")

    await fetch('/get_updated_tex_file', {
        method: 'POST'
    });

    console.log("/get_updated_tex_file completed")

    await uploadUpdatedTexFile();

    console.log("uploadUpdatedTexFile completed")

    await save_pickled_tex_states();

    console.log("pickled tex states were saved")

    

});

// Redo

document.getElementById("output-redo").addEventListener('click', async function() {

    await fetch('/redo_for_review_section', {
        method: 'POST'
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

    console.log("uploadUpdatedTexFile completed")


    await save_pickled_tex_states();

    console.log("pickled tex states were saved")


});



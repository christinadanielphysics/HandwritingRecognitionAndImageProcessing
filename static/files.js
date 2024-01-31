import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, uploadBytes, getStorage, getMetadata, updateMetadata } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { app } from './initialize.js';

function createProjectName() {

    // Create date object
    const now = new Date();
  
    // Get milliseconds since Unix epoch
    const ms = now.getTime(); 
  
    // Append milliseconds to date string  

    const uniqueString = now.toISOString() + "&" + ms;

    localStorage.setItem("projectName",uniqueString);

    console.log("The project name has been created and it is ", uniqueString);
  
}
  

async function uploadNewTexFile() {

    const texFile = await fetch('/get_new_tex_file', { // sending the new tex file from flask to javascript so that can upload the new tex file to Firebase Storage
      method: 'POST'
    });

    let arrayBuffer = await texFile.arrayBuffer();
  
    let file = new File([arrayBuffer], 'tex_file.tex',  {type: 'application/x-tex'});

    let auth = getAuth(app);
    
    const uid = auth.currentUser.uid;
  
    const uidString = uid.toString();

    let projectName = localStorage.getItem("projectName");
  
    const filepath = "users/"+uidString+"/"+projectName+"/review.tex";

    console.log("the filepath is in uploadNewTexFile() is: ",filepath);

    let storage = getStorage(app);
  
    let destination = ref(storage, filepath);
  
    await uploadBytes(destination, file);

    console.log("uploadNewTexFile() completed");
  
}

async function uploadNewPDFFile() {

    const pdfFile = await fetch('/get_new_pdf_file', {
        method: 'POST'
    });

    let arrayBuffer = await pdfFile.arrayBuffer();

    let file = new File ([arrayBuffer], 'pdf_file.pdf', {type: 'application/pdf'});

    let auth = getAuth(app);

    const uid = auth.currentUser.uid;

    const uidString = uid.toString();

    let projectName = localStorage.getItem("projectName");

    const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";

    console.log("the filepath is in uploadNewPDFFile() is: ",filepath);

    let storage = getStorage(app);

    let destination = ref(storage,filepath);



    const metadata = {
        customMetadata: {
          'name_of_project': "My Workspace"
        }
      };



    

    await uploadBytes(destination, file, metadata);

    console.log("uploadNewPDFFile completed");

}


async function uploadUpdatedTexFile() {

    let updatedTexFile  = await fetch('/get_updated_tex_file', {
        method: 'POST'
    });

    let arrayBuffer = await updatedTexFile.arrayBuffer();

    let file = new File([arrayBuffer], 'tex_file.tex', {type: 'application/x-tex'});

    let auth = getAuth(app);

    const uid = auth.currentUser.uid;

    const uidString = uid.toString();

    let projectName = localStorage.getItem("projectName");

    const filepath = "users/"+uidString+"/"+projectName+"/review.tex";

    console.log("the filepath is in uploadUpdatedTexFile() is: ", filepath);

    let storage = getStorage(app);

    let destination = ref(storage, filepath);

    await uploadBytes(destination, file);

    console.log("uploadUpdatedTexFile() completed");

}


async function uploadUpdatedPDFFile() {

    let updatedPDFFile = await fetch('/update_pdf_for_display', {
        method: 'POST'
    });

    let arrayBuffer = await updatedPDFFile.arrayBuffer();

    let file = new File([arrayBuffer], 'pdf_file.pdf', {type: 'application/pdf'});

    let auth = getAuth(app);

    const uid = auth.currentUser.uid;

    const uidString = uid.toString();

    let projectName = localStorage.getItem("projectName");

    const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";

    console.log("the filepath is in uploadUpdatedPDFFile() is: ", filepath);

    let storage = getStorage(app);

    let destination = ref(storage, filepath);

    let customName = localStorage.getItem("customName");

    const metadata = {
        customMetadata: {
          'name_of_project': customName
        }
      };

    await uploadBytes(destination, file, metadata);

    

    console.log("uploadUpdatedPDFFile() completed");

}

async function removeWorkingDirectory() {

    await fetch('/remove_working_directory', {
      method: 'POST'
    });
  
}

async function setWorkingDirectory() {

    let auth = getAuth(app);
  
    const uid = auth.currentUser.uid;
  
    const uidString = uid.toString();
  
    let projectName = localStorage.getItem("projectName");
  
    const filepath = "users/"+uidString+"/"+projectName+"/"
  
    let working_directory = filepath;
  
    await fetch('/set_working_directory', {
      method: 'POST',
      body: working_directory
    });
  
  }


async function updateProjectNameViaMetaData(new_name) {


    let auth = getAuth(app);

    const uid = auth.currentUser.uid;

    const uidString = uid.toString();

    let projectName = localStorage.getItem("projectName");

    const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";

    let storage = getStorage(app);

    let destination = ref(storage, filepath);


    const newMetadata = {
        customMetadata: {
          'name_of_project': new_name
        }
      };

    // Update metadata properties
    await updateMetadata(destination, newMetadata)
    .then((metadata) => {
    // Updated metadata 
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });

    console.log("custom name updated...")

}

async function updateCustomProjectName() {

    let new_name = localStorage.getItem("customName");
    
    console.log("the user wants to change the name which is currently", new_name);

    let proposed_name = window.prompt("Update Name of Workspace:");

    console.log("the proposed name is", proposed_name);

    if (proposed_name != null) {
      new_name = proposed_name;
    }

    localStorage.setItem("customName",new_name);

    await updateProjectNameViaMetaData(new_name);

}



export {uploadNewTexFile, uploadUpdatedTexFile, createProjectName, uploadNewPDFFile, uploadUpdatedPDFFile, removeWorkingDirectory, setWorkingDirectory, updateCustomProjectName };
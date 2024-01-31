import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from './initialize.js';
import { uploadNewTexFile, createProjectName, uploadNewPDFFile, removeWorkingDirectory, setWorkingDirectory } from './files.js';
import { ref, getStorage, getDownloadURL, listAll, deleteObject, getMetadata } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { setProjectNamesArray } from './table.js';
import {save_pickled_tex_states, send_pickled_tex_states} from './load.js'

// Authentication

let auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user is signed in", user)
  } else {
    window.location.href = '/login'; // redirect
  }
});

document.getElementById("documents-sign-out").addEventListener('click', async function() {

  signOut(auth).then(() => {

    localStorage.setItem("projectNamesArray",JSON.stringify([]));
    localStorage.setItem("customNamesArray",JSON.stringify([]));
    localStorage.setItem("textAreaData", "");
    localStorage.setItem("mathjaxStatesData",JSON.stringify([]));
    localStorage.setItem("texStatesData",JSON.stringify([]));
    localStorage.setItem("projectName","");
    localStorage.setItem("customName","");

    
    console.log("user is logged out");
  }).catch((error) => {
      console.log("log out error");
  });

  await removeWorkingDirectory();

  window.location.href = '/login';

});


// New Project

document.getElementById("new-project").addEventListener('click', async function(event) {
  
  localStorage.setItem("textAreaData", "");
  localStorage.setItem("mathjaxStatesData",JSON.stringify([``]));
  localStorage.setItem("texStatesData",JSON.stringify([""]));
  localStorage.setItem("customName","My Workspace");

  event.preventDefault();  // this line related to the HTML button needs to be here; otherwise, the following code isn't completely executed

  createProjectName();
  
  await setWorkingDirectory();
  
  await getNewPDFFile();
  
  await uploadNewTexFile();

  await uploadNewPDFFile();

  await setProjectNamesArray();

  await resetTexStates(); // new document; reset the pylatex tex states on the flask side

  await save_pickled_tex_states(); // creates review.bin 

  window.location.href = '/create';

});


async function resetTexStates() {

  await fetch('/reset_tex_states', {
    method: 'POST'
  });

}

async function getNewPDFFile() { 

  const pdfFile = await fetch('/get_new_pdf_file', {
    method: 'POST'
  });

}




// Table
async function displayTable() {

  let table = document.getElementById("dataTable");
  
  let outerWrapper = document.getElementById("wrapper-outer");
  outerWrapper.style.display = "none"; // hide 

  // get projectNamesArray from local storage

  let projectNamesArray = localStorage.getItem("projectNamesArray");
  


  if (projectNamesArray != null) {

    projectNamesArray = JSON.parse(projectNamesArray); // these are the folders for a given user

  }


  for (let i = 0; i < projectNamesArray.length; i++) {

    outerWrapper.style.display = "inline"; // show 

    let projectName = projectNamesArray[i];

    let row = table.insertRow();

    let nameCell = row.insertCell();
    let dateCell = row.insertCell();

    await addElementsToNameCell(nameCell,projectName,i);
    addElementsToDateCell(dateCell,projectName);

  }

}

window.onload = async function() {

  await displayTable();

}

function addElementsToDateCell(dateCell, projectName) {

  let dateLabel = document.createElement("label");
  dateLabel.textContent = extractDateCreated(projectName);

  dateCell.style.textAlign = "center";

  dateCell.appendChild(dateLabel);

}

async function extractProjectName(projectName,i) {

  let customNamesArray = localStorage.getItem("customNamesArray");

  if (customNamesArray != null) {

    customNamesArray = JSON.parse(customNamesArray);
  }

  console.log("The custom project name is",customNamesArray[i])


  return customNamesArray[i]


}

function extractDateCreated(projectName) {

  // Declare variables                             
  let date;
  let month;  
  let day;
  let year;
                                                                                                    
  // Split into date part and millisecond part
  const dateParts = projectName.split("&");
 
  // Get just the date part without the millisecond part
  const datePart = dateParts[0];
                                                                                                    
  // Convert string into date object                            
  date = new Date(datePart);
                                                                                                                            
  // Get month, day and year
  month = date.toLocaleString('default', { month: 'long' });
  day = date.getDate();
  year = date.getFullYear();                                               
                                                                                                      
  // Concatenate into desired format                  
  return `${month} ${day}, ${year}`;
}

async function saveTex(file, directory, working_directory) {

  let formData = new FormData();
  formData.append('file', file);

  await fetch('/save_tex', {
    method: 'POST',
    body: formData
  });

  console.log("tex file sent from javascript to flask")

}

async function savePDF(file, directory, working_directory) {

  let formData = new FormData();
  formData.append('file', file);

  await fetch('/save_pdf', {
    method: 'POST',
    body: formData
  });

  console.log("pdf file sent from javascript to flask")

}

async function editProject(projectName,i) {

  // get custom name set by user or by default

  let customName = await extractProjectName(projectName,i);

  // update local storage

  localStorage.setItem("customName",customName);
  localStorage.setItem("projectName",projectName);
  localStorage.setItem("textAreaData", "");
  localStorage.setItem("mathjaxStatesData",JSON.stringify([``]));
  localStorage.setItem("texStatesData",JSON.stringify([""]));

  // update variables for Firebase

  let auth = getAuth(app);

  let uid = auth.currentUser.uid;

  let uidString = uid.toString();

  let storage = getStorage(app);

  // set the working directory
  // note: working_directory is used in this function

  let working_directory = "users/"+uidString+"/"+projectName+"/" 

  await fetch('/set_working_directory', {
    method: 'POST',
    body: working_directory
  });

  // tex

  let directory = "users/"+uidString+"/"+projectName + "/review.tex";

  let directoryReference = ref(storage,directory);

  let url = await getDownloadURL(directoryReference);

  let result = await fetch(url);

  let buffer = await result.arrayBuffer();

  let file = new File([buffer], "review.tex", {type: 'application/x-tex'});

  await saveTex(file,directory,working_directory);

  // pdf

  directory = "users/"+uidString+"/"+projectName + "/review.pdf";

  directoryReference = ref(storage,directory);

  url = await getDownloadURL(directoryReference);

  result = await fetch(url);

  buffer = await result.arrayBuffer();

  file = new File([buffer], "review.tex", {type: 'application/pdf'});

  await savePDF(file,directory,working_directory);

  await send_pickled_tex_states();

  window.location.href = '/create';

}

async function setupTexStates() {

    await fetch('/setup_tex_states', {
      method: 'POST'
    });
    
}

async function deleteProject(projectName) {

  let auth = getAuth(app);

  let uid = auth.currentUser.uid;

  let uidString = uid.toString();

  let folder = "users/"+uidString+"/"+projectName;

  let storage = getStorage(app);

  let folderReference = ref(storage,folder);

  let listOfFiles = await listAll(folderReference);

  for (let i = 0; i < listOfFiles.items.length; i++ ) {
    
    let fileReference = listOfFiles.items[i];

    await deleteObject(fileReference);

  }

  // update local storage

  await setProjectNamesArray();

  // deletes all rows except the header row from a table

  const table = document.getElementById('dataTable');

  let numberOfRows = table.rows.length - 1;

  for (let i = 1; i <= numberOfRows; i++) {
    table.deleteRow(1);
  }

  // display table

  await displayTable();

}

async function doXHR(destination, name) {

  getDownloadURL(destination).then((url) => {

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const url = URL.createObjectURL(xhr.response);
      const link = document.createElement('a');
      // link.href = url;
      // link.download = name;
      link.setAttribute('href', url);
      link.setAttribute('download',name);
      link.click();
    };
    xhr.open('GET', url);
    xhr.send();
    console.log("xhr sent")

  }).catch((error) => {
    console.log("error downloading pdf or tex file from cloud");
  });
}

async function downloadPDF(projectName) {

  let auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const uidString = uid.toString();
  let storage = getStorage(app);

  // Download PDF File
  const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";
  let destination = ref(storage, filepath);
  let name = projectName + ".pdf";
  await doXHR(destination,name);

}

async function downloadTex(projectName) {

  let auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const uidString = uid.toString();
  let storage = getStorage(app);

  // Download Tex File
  const filepath = "users/"+uidString+"/"+projectName+"/review.tex";
  const destination = ref(storage, filepath);
  const name = projectName + ".tex";
  await doXHR(destination,name);

}



async function viewPDF(projectName) {
  
  let auth = getAuth(app);
  const uid = auth.currentUser.uid;
  const uidString = uid.toString();
  let storage = getStorage(app);

  // Download PDF File
  const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";
  let destination = ref(storage, filepath);
  let name = projectName + ".pdf";

  await getDownloadURL(destination).then((url) => {

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const url = URL.createObjectURL(xhr.response);
      window.open(url);
    };
    xhr.open('GET', url);
    xhr.send();
    console.log("xhr sent")

  }).catch((error) => {
    console.log("error displaying pdf");
  });

}

 

async function addElementsToNameCell(nameCell,projectName,i) {

  nameCell.style.display = "flex";
  nameCell.style.alignItems = "center";

  // Create the buttons
  let editBtn = document.createElement("button");
  editBtn.classList.add("cell-button");
  let editIcon = document.createElement("i");
  editIcon.classList.add("bx", "bxs-edit");
  editBtn.appendChild(editIcon);
  editBtn.addEventListener('click', async function() {
    await editProject(projectName,i);
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("cell-button");
  let deleteIcon = document.createElement("i"); 
  deleteIcon.classList.add("bx", "bxs-trash");
  deleteBtn.appendChild(deleteIcon);
  deleteBtn.addEventListener('click', async function() {
    await deleteProject(projectName);
  });

  let downloadPDFBtn = document.createElement("button"); 
  downloadPDFBtn.classList.add("cell-button");
  let downloadPDFIcon = document.createElement("i");
  downloadPDFIcon.classList.add("bx", "bxs-file-pdf"); 
  downloadPDFBtn.appendChild(downloadPDFIcon);
  downloadPDFBtn.addEventListener('click', async function() {
    await downloadPDF(projectName);
  });

  let downloadTexBtn = document.createElement("button"); 
  downloadTexBtn.classList.add("cell-button");
  let downloadTexIcon = document.createElement("i");
  downloadTexIcon.classList.add("bx", "bx-text"); 
  downloadTexBtn.appendChild(downloadTexIcon);
  downloadTexBtn.addEventListener('click', async function() {
    await downloadTex(projectName);
  });

  let fullscreenBtn = document.createElement("button");
  fullscreenBtn.classList.add("cell-button");  
  let fullscreenIcon = document.createElement("i");
  fullscreenIcon.classList.add("bx", "bx-fullscreen");
  fullscreenBtn.appendChild(fullscreenIcon);
  fullscreenBtn.addEventListener('click', async function() {
    await viewPDF(projectName);
  });

  let projectNameLabel = document.createElement("label");
  projectNameLabel.classList.add('name');
  projectNameLabel.textContent = await extractProjectName(projectName,i);


  // Append elements to cell  

  nameCell.appendChild(projectNameLabel);
  nameCell.appendChild(editBtn); 
  nameCell.appendChild(deleteBtn);
  nameCell.appendChild(downloadPDFBtn);
  nameCell.appendChild(downloadTexBtn);
  nameCell.appendChild(fullscreenBtn);


}







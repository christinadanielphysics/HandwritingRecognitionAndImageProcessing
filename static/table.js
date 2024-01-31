import { app } from './initialize.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { deleteObject, getDownloadURL, ref, getStorage, listAll, getMetadata } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


function getFolderReference() {

    let auth = getAuth(app);

    const uid = auth.currentUser.uid;

    const uidString = uid.toString();

    let folderPath = "users/"+uidString;

    let storage = getStorage(app);

    let folderReference = ref(storage, folderPath);
  
    return folderReference;

}

async function thereAreFiles(projectName) {

    let auth = getAuth(app);

    let uid = auth.currentUser.uid;
  
    let uidString = uid.toString();
  
    let folder = "users/"+uidString+"/"+projectName;
  
    let storage = getStorage(app);
  
    let folderReference = ref(storage,folder);
  
    let listOfFiles = await listAll(folderReference);

    if (listOfFiles.items.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

async function setProjectNamesArray() {

    let result = await listAll(getFolderReference());

    let projectNamesArray = result.prefixes.map(folder => folder.name);

    let projectsWithFiles = [];
    let customNames = []; // these are the default or user-set names of the projects

    for (let i = 0; i < projectNamesArray.length; i++) {

        let projectName = projectNamesArray[i]; // projectName gives information about where files are stored on Firebase Storage

        if (await thereAreFiles(projectName)) {

            projectsWithFiles.push(projectName);
            let customName = await getCustomProjectName(projectName);
            customNames.push(customName)

        }

    }

    localStorage.setItem("projectNamesArray",JSON.stringify(projectsWithFiles));
    localStorage.setItem("customNamesArray",JSON.stringify(customNames));

}

async function getCustomProjectName(projectName) {

    let auth = await getAuth(app);

    console.log("THE AUTH IS",auth);
  
    const uid = auth.currentUser.uid;
  
    const uidString = uid.toString();
  
    const filepath = "users/"+uidString+"/"+projectName+"/review.pdf";
  
    let storage = getStorage(app);
  
    let destination = ref(storage, filepath);
  
  
  
    let myVariable = "tbd"
  
    // Get metadata properties
    await getMetadata(destination)
    .then((metadata) => {
    myVariable = metadata.customMetadata.name_of_project;
    });
  
    console.log("THIS is the metadata", myVariable);
  
    return myVariable
}


export { setProjectNamesArray };



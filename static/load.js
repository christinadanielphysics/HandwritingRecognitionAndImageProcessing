import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from './initialize.js';
import { ref, getStorage, getDownloadURL, listAll, deleteObject, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


async function save_pickled_tex_states() { // saving states to Firebase Storage

    let result = await fetch('/unload_pickled_tex_states');
    let pickledStates = await result.blob();

    // upload pickledStates to Firebase Storage
    let auth = getAuth(app);
    const uid = auth.currentUser.uid;
    const uidString = uid.toString();
    let projectName = localStorage.getItem("projectName");
    const filepath = "users/"+uidString+"/"+projectName+"/review.bin";
    let storage = getStorage(app);
    let destination = ref(storage,filepath);
    await uploadBytes(destination, pickledStates);
    console.log("pickled states were uploaded to Firebase Storage")
}

async function send_pickled_tex_states() { // editing project, so retrieve states from Firebase Storage

    // retrieve pickledStates from Firebase Storage
    let auth = getAuth(app);
    const uid = auth.currentUser.uid;
    const uidString = uid.toString();
    let projectName = localStorage.getItem("projectName");
    const filepath = "users/"+uidString+"/"+projectName+"/review.bin";
    let storage = getStorage(app);
    let destination = ref(storage,filepath);


    let url = await getDownloadURL(destination); 

    let response = await fetch(url);

    let pickledStates = await response.blob();

    console.log("pickledStates", pickledStates);


    await fetch('/load_pickled_tex_states', { // send the retrieved pickled states to flask
        method: 'POST',
        body: pickledStates
    });


}

export {save_pickled_tex_states, send_pickled_tex_states}
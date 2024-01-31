import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { app } from './initialize.js';
import { setProjectNamesArray } from './table.js';

let auth = getAuth(app);



let loginButton = document.getElementById("login-button").addEventListener('click', function() {
    login();
});
    
let registerButton = document.getElementById("register-button").addEventListener('click', function() {
    register();
});


let emailField = document.getElementById("email-login");


function getEmail() {

    let email = emailField.value
    return email
}

let forgotPasswordLink = document.getElementById("forgot-password-link").addEventListener('click', (event) => {
    event.preventDefault();

    const email = getEmail();

    if (email == "" || email == " ") {
        alert("Type your email in the 'Email' field. Then click the 'Forgot Password?' link.")
    }
    else {
        alert("Check your email for a message from noreply@scribble2symbol.firebaseapp.com.")
    }

    sendPasswordResetEmail(auth, email)
    .then(()=> console.log("reset password link sent"))
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error sending password reset link: ", errorMessage)
    });
})


function register() {

    let emailAddress = document.getElementById("email-register").value;
    let password = document.getElementById("password-register").value;

    if (!validEmailFormat(emailAddress)) {
        alert('Please enter a valid email address.');
        return
    }

    if (!validPasswordFormat(password)) {
        alert('The password must contain at least six characters.');
        return
    }

    createUserWithEmailAndPassword(auth,emailAddress,password).then( function() {
        
        alert('Account created successfully!')

    })
    .catch( function(error) {

        let error_code = error.code;
        let error_message = error.message;
        alert(error.message);

    });

}





function validEmailFormat(emailAddress) {

    let format = /@/;

    if (format.test(emailAddress) == true) {
        return true;

    }
    else {
        return false;
    }
}

function validPasswordFormat(password) {
    if (password.length < 6) {
        return false
    } else {
        return true
    }
}


function login() {

    let emailAddress = document.getElementById("email-login").value;
    let password = document.getElementById("password-login").value;

    if (!validEmailFormat(emailAddress)) {
        alert('Please enter a valid email address.');
        return
    }

    if (!validPasswordFormat(password)) {
        alert('The password must contain at least six characters.');
        return
    }

    signInWithEmailAndPassword(auth, emailAddress, password).then( async function() {

        await setProjectNamesArray();

        window.location.href = '/documents';
       
    })
    .catch( function(error) {

        let error_code = error.code;
        let error_message = error.message;
        
        alert(error.message);

    })

}

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
    console.log("Register link");
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
    console.log("Login Link");
});
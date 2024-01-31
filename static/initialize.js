import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyArnOs4NoVmSnd2DOY1QMb3hGZfXxynnb0",
authDomain: "scribble2symbol.firebaseapp.com",
databaseURL: "https://scribble2symbol-default-rtdb.firebaseio.com",
projectId: "scribble2symbol",
storageBucket: "scribble2symbol.appspot.com",
messagingSenderId: "561129797363",
appId: "1:561129797363:web:ab194dcabf8306f3c0a986",
measurementId: "G-RPDXVS4TZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
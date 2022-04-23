const firebase = require('firebase/app');

const firebaseConfig = {
  apiKey: 'AIzaSyCkXlMSnFVpX6__jBow7AsVoN41Wz9LiIs',
  authDomain: 'fiubify.firebaseapp.com',
  projectId: 'fiubify',
  storageBucket: 'fiubify.appspot.com',
  messagingSenderId: '437257657611',
  appId: '1:437257657611:web:63b2169b06367d8ea5560e',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp;

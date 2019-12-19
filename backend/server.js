const DB_CONFIG = require("./Config");
const sendGridMail = require("@sendgrid/mail");
const firebase = require("firebase");

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);


function readAndSend() {
    // firebase.initializeApp(DB_CONFIG);

    firebase.database().ref("/").on('value', function (snap) {
       snap.forEach(function (childNodes) {
           console.log(childNodes);
       });
    });
}



const message = {
    to: 'vipulsharma018@gmail.com',
    from: 'vipsworldwide@gmail.com',
    subject: "Sending message from Twillio's SendGrid API",
    text: "Some text in here",
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
// sendGridMail.send(message);
readAndSend();
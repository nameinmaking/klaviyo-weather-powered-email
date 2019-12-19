import React from 'react';
import data from './cities';
import Firebase from 'firebase';
import DB_CONFIG from './Config';
const ADMIN_EMAIL = "vipulsharma018@gmail.com";
const sendGridMail = require("@sendgrid/mail");
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;

class App extends React.Component {

    constructor(props) {
        super(props);
        Firebase.initializeApp(DB_CONFIG);
        sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

        this.state = {
            email: "",
            city: "",
            longitude: "",
            latitude: "",
            sendEmail: false
        };
        this.emailIsValid = this.emailIsValid.bind(this);
        this.subscribeUser = this.subscribeUser.bind(this);
        this.signInAdmin = this.signInAdmin.bind(this);
    }


    writeUserData = () => {
        // let userData = {
        //     [this.state.email]: {
        //         "city": this.state.city,
        //         "longitude": this.state.longitude,
        //         "latitude": this.state.latitude
        //     }
        // };
        // alert(JSON.stringify(userData));
        Firebase.database()
            .ref("/")
            .child(this.state.email.replace(".", "_"))
            .set(this.state);
        console.log("Data Saved!");
    };

    getUserData = () => {
        let ref = Firebase.database().ref("/");
        ref.on("value", snapshot => {
            const state = snapshot.val();
            this.setState(state);
        });
    };

    componentDidMount() {
        let dropdown = document.getElementById('dropdown');
        dropdown.length = 0;

        let defaultOption = document.createElement('option');
        defaultOption.text = 'Choose City';

        dropdown.add(defaultOption);
        dropdown.selectedIndex = 0;

        let option;

        for (let i = 0; i < data.length; i++) {
            option = document.createElement('option');
            option.text = data[i].city;
            option.value = [data[i].city, data[i].latitude, data[i].longitude];
            dropdown.add(option);
        }

        this.getUserData();
    }

    render() {
        return (
            <div>
                <div className="form-label-group">
                    <div className="dropdown show">
                        <select className="form-control form-control-lg" id="dropdown"
                                onChange={this.selectHandleChange}
                                value={this.state.city}
                        >
                        </select>
                    </div>
                </div>

                <button className="btn btn-lg btn-primary btn-block" type="submit"
                        onClick={this.subscribeUser}> Subscribe
                </button>

                    <button className="btn btn-lg btn-warning btn-block" type="button" id="signInButton"
                            onClick={this.signInAdmin}> Sign In (admin)
                    </button>
            </div>
        );
    }

    sendEmails() {

        Firebase.database().ref("/").on('value', function(snap){

            snap.forEach(function(childNodes){
                console.log("DARKSKY_API_KEY" + DARKSKY_API_KEY);
                console.log(childNodes.val().city);
                console.log(childNodes.val().email);
                console.log(childNodes.val().longitude);
                console.log(childNodes.val().latitude);

                console.log(fetch("https://api.darksky.net/forecast/" + DARKSKY_API_KEY + "/" + childNodes.val().longitude + "," + childNodes.val().latitude));

                // const message = {
                //     to: childNodes.val().email,
                //     from: ADMIN_EMAIL,
                //     subject: "Your weather report for " + childNodes.val().city,
                //     text: fetch("https://api.darksky.net/forecast/" + DARSKY_API_KEY + "/" + childNodes.val().longitude + "," + childNodes.val().latitude),
                //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                // };
                //
                // sendGridMail.send(message);

            });
        });






    }


    signInAdmin() {
        if (this.state.sendEmail) {
            this.setState({sendEmail: false});
            document.querySelector('#signInButton').innerHTML = 'SigIn (admin)';
            this.sendEmails();
        } else if (document.getElementById("inputEmail").value) {
            if (document.getElementById("inputEmail").value === ADMIN_EMAIL) {
                this.setState({sendEmail: true});
                document.querySelector('#signInButton').innerHTML = 'Send Email';
            } else {
                alert("Not an admin email!");
            }
        }
    }

    async subscribeUser() {
        if (document.getElementById("inputEmail").value) {
            await this.setState({email: document.getElementById("inputEmail").value});
            this.writeUserData();
        }
    }

    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    selectHandleChange = (event) => {
        let str = event.target.value;
        let match = str.split(',');
        this.setState({city: match[0], longitude: match[1], latitude: match[2]});
    };
}

export default App;



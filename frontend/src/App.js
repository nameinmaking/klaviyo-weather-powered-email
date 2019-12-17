import React from 'react';
import data from './cities';
import Firebase from 'firebase';
import DB_CONFIG from './Config';

class App extends React.Component {

    constructor(props) {
        super(props);
        Firebase.initializeApp(DB_CONFIG);

        this.state = {
            email: "",
            city: "",
            longitude: "",
            latitude: ""
        };
        this.emailIsValid = this.emailIsValid.bind(this);
        this.subscribeUser = this.subscribeUser.bind(this);
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
            </div>
        );
    }

    async subscribeUser() {
        if (document.getElementById("inputEmail").value) {
            console.log("here");
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



import React from 'react';
import data from './cities';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            city: ""
        };
        this.emailIsValid = this.emailIsValid.bind(this);
        this.subscribeUser = this.subscribeUser.bind(this);
    }

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
            option.value = [data[i].latitude, data[i].longitude];
            dropdown.add(option);
        }

        console.log(option);
    }

    render() {
        return (
            <div>

                <div className="form-label-group">
                    <div className="dropdown show">
                        <select className="form-control form-control-lg" id="dropdown"
                                onChange={this.selectHandleChange} value={this.state.city}>
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
            await this.setState({email: document.getElementById("inputEmail").value});
            alert(this.state.email + this.state.city);
        }

    }

    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    selectHandleChange = (event) => {
        this.setState({city: event.target.value});
    };
}

export default App;



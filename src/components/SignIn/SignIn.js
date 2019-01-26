import React from 'react';
import './SignIn.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      error: ''
    };
  }

  onNameChange = (event) => {
      this.setState({ name: event.target.value });
    }

    onEmailChange = (event) => {
      this.setState({ email: event.target.value });
    }

    onPasswordChange = (event) => {
      this.setState({ password: event.target.value });
    }

    onSubmit = () => {
      const url = '/' + this.props.route;
      fetch(url,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            name: this.state.name
          }),
        }).then(response => response.json())
        .then((data) => {
          if (data.id) {
            this.props.loadUser(data);
            this.props.onRouteChange('home');
          } else {
            this.setState({
              error: data
            })
          }
        });
    }

    render() {
      const title = this.props.route.toUpperCase();
      return (
        
        <div className="form-container">
        <div className="form">
            <h3 className="form-title">{title}</h3>
            <div className="form-input-container">
            {this.state.error ? <div className="error-message">{this.state.error}</div> : '' }
            {this.props.route === "register" ? <div className="input-container">
                <label htmlFor="name">Name</label>
                <input onChange={this.onNameChange} type="text" name="name" id="name" required/>
            </div> : '' }
            <div className="input-container">
                <label htmlFor="email-address">Email</label>
                <input onChange={this.onEmailChange} type="email" name="email-address" id="email-address" required/>
            </div>
            <div className="input-container">
                <label htmlFor="password">Password</label>
                <input onChange={this.onPasswordChange} type="password" name="password" id="password" required/>
            </div>
            </div>
            <div>
            <input className="submit-btn" onClick={this.onSubmit} type="submit" value="Sign in" />
            </div>
            </div>
        </div>
      );
    }
}

export default SignIn;

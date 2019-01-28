import React from 'react';
import './SignIn.css';

interface Props {
  loadUser: any,
  route: string,
  onRouteChange: any
}

interface State {
  email: string,
  password: string,
  name: string,
  error: string
}

class SignIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      error: ''
    };
  }

  onNameChange = (event:any) => {
      this.setState({ name: event.target.value });
    }

    onEmailChange = (event:any) => {
      this.setState({ email: event.target.value });
    }

    onPasswordChange = (event:any) => {
      this.setState({ password: event.target.value });
    }

    onSubmit = () => {
      const url:string = '/' + this.props.route;
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
      const title:string = this.props.route.toUpperCase();
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

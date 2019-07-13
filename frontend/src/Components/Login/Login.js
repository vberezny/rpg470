import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import "./Login.scss";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  handleSignup = () => {
    console.log('Signup button pressed');
  }

  handleLogin = (event) => {
    event.preventDefault();
    console.log('Login button pressed');
  }

  handleChangeUsername = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  handleChangePassword = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  render () {
    return (
      <div className="login-page">
        <header className="login-header">
          <h1 className="login-header-text">Welcome to RPG470!</h1>
          <Form onSubmit={this.handleLogin}>
            <FormGroup className="login-form-group">
              <Label for="username" className="login-form-label">Username</Label>
              <Input type="username" id="username" onChange={this.handleChangeUsername}/>
            </FormGroup>
            <FormGroup className="login-form-group">
              <Label for="password" className="login-form-label">Password</Label>
              <Input type="password" id="password" onChange={this.handleChangePassword}/>
            </FormGroup>
            <Button color="primary" className="login-button">
              Login
            </Button>
          </Form>
          <h3 className="signup-header">Don't have an account?
            <Button color="primary" className="signup-button" onClick={this.handleSignup}>
              Sign up
            </Button>
          </h3>
        </header>
      </div>
    );
  }
}

export default Login;
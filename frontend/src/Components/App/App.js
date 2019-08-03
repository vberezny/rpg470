import React from 'react';
import {HashRouter as Router, Route, Redirect} from 'react-router-dom';
import {
  GLOBAL_NUMBERS,
  GLOBAL_URLS
} from '../../Constants/GlobalConstants';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Home from '../Home/Home';
import CreateCharacter from '../CreateCharacter/CreateCharacter';
import Battle from '../Battle/Battle';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCharacterNewlyCreatedToast: false,
      isAuthenticated: false,
      isCharacterSelected: false,
      currentCharacterName: ''
    };
  }

  async componentDidMount() {
    await this.handleAuthenticate();
  }

  handleRenderProtectedPage = (page) => {
    if (this.state.isAuthenticated) {
      return page;
    } else {
      return <Redirect to="/login"/>
    }
  };

  handleRenderLoginOrSignupPage = (page) => {
    if (this.state.isAuthenticated) {
      return <Redirect to="/"/>;
    } else {
      return page;
    }
  };

  handleAuthenticate = async () => {
    const response = await fetch(GLOBAL_URLS.GET_API_USERS_LOGGED_IN);
    this.setState({
      isAuthenticated: response.status !== GLOBAL_NUMBERS.HTTP_STATUS_CODE_403
    });
  };

  handleConfirmCharacterSelection = (currentCharacterName, showCharacterNewlyCreatedToast=false) => {
    this.setState({
      showCharacterNewlyCreatedToast,
      isCharacterSelected: true,
      currentCharacterName
    });
  };

  // TODO: Refactor such that we don't have one state entry for each specific toast
  handleCloseCharacterNewlyCreatedToast = () => {
    this.setState({
      showCharacterNewlyCreatedToast: false
    });
  };

  handleUnauthenticate = async () => {
    const response = await fetch(GLOBAL_URLS.POST_API_USERS_LOGOUT, {
      method: 'POST',
      mode: 'cors'
    });
    if (response.status === GLOBAL_NUMBERS.HTTP_STATUS_CODE_200) {
      this.setState({
        isAuthenticated: false,
        isCharacterSelected: false,
        currentCharacterName: ''
      });
    }
  };

  render() {
    return (
      <Router>
        <Route
          exact
          path="/"
          component={() => this.handleRenderProtectedPage(<Home
            showCharacterNewlyCreatedToast={this.state.showCharacterNewlyCreatedToast}
            isCharacterSelected={this.state.isCharacterSelected}
            currentCharacterName={this.state.currentCharacterName}
            handleCloseCharacterNewlyCreatedToast={this.handleCloseCharacterNewlyCreatedToast}
            handleConfirmCharacterSelection={this.handleConfirmCharacterSelection}
            handleUnauthenticate={this.handleUnauthenticate}
          />)}
        />
        <Route
          path="/login"
          component={() => this.handleRenderLoginOrSignupPage(<Login
            handleAuthenticate={this.handleAuthenticate}
          />)}
        />
        <Route
          path="/signup"
          component={() => this.handleRenderLoginOrSignupPage(<Signup
            handleAuthenticate={this.handleAuthenticate}
          />)}
        />
        <Route
          path="/createcharacter"
          component={props => this.handleRenderProtectedPage(<CreateCharacter
            handleUnauthenticate={this.handleUnauthenticate}
            handleConfirmCharacterSelection={this.handleConfirmCharacterSelection}
            {...props}
          />)}
        />
        <Route
          path="/battle"
          component={() => this.handleRenderProtectedPage(<Battle
            handleUnauthenticate={this.handleUnauthenticate}
            currentCharacterName={this.state.currentCharacterName}
          />)}
        />
      </Router>
    );
  }
}

export default App;

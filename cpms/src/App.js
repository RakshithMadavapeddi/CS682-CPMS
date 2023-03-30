import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/register">
            <RegistrationForm />
          </Route>
          <Route>
            <h1>Page not found</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


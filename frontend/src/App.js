import './App.css';
import Home from './Home.js'
import Login from './Login.js'
import SignUp from './Signup';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';

function App() {
  return (
    
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;

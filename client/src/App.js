import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/layouts/Navbar";
import Footer from "./Components/layouts/Footer";
import Landing from "./Components/layouts/Landing";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import { Provider } from "react-redux";
import store from './store'; 


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

import React, { Component } from "react";
import "./App.css";
import Navbar from "./Components/layouts/Navbar";
import Footer from "./Components/layouts/Footer";
import Landing from './Components/layouts/Landing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing/>
        <Footer />
      </div>
    );
  }
}

export default App;

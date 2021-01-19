import React, { FC } from "react";
import { Button } from "ui-lib";
import "./App.css";
import logo from "./logo.svg";

const App: FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button primary>Learn React</Button>
      </a>
    </header>
  </div>
);

export default App;

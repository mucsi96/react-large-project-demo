import React, { FC } from 'react';
import { Button, FriendsList } from 'ui-lib';
import './App.css';
import logo from './logo.svg';

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
        <FriendsList />
      </a>
    </header>
  </div>
);

export default App;

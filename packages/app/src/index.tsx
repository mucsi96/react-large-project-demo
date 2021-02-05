import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { setupApiMocks } from 'friends';
import { WaitForMockApi, setMockApiDelay } from 'mock-api';

let app = <App />;

if (process.env.REACT_APP_USE_MOCK_API === 'true') {
  setupApiMocks();
  setMockApiDelay(750);

  app = <WaitForMockApi>{app}</WaitForMockApi>;
}

ReactDOM.render(
  <React.StrictMode>{app}</React.StrictMode>,
  document.getElementById('root')
);

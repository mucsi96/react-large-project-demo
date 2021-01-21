import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { setupApiMocks } from 'ui-lib';
import { WaitForMockApi } from 'dev-tools';

let app = <App />;

if (
  process.env.REACT_APP_USE_MOCK_API ||
  process.env.NODE_ENV === 'development'
) {
  setupApiMocks();

  app = <WaitForMockApi>{app}</WaitForMockApi>;
}

ReactDOM.render(
  <React.StrictMode>{app}</React.StrictMode>,
  document.getElementById('root')
);

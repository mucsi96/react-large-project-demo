import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { setupApiMocks } from 'friends';
import { WaitForMockApi, setMockApiDelay } from 'mock-api';

function renderApp(): ReactNode {
  const app = <App />;

  if (process.env.REACT_APP_USE_MOCK_API !== 'true') {
    return app;
  }

  setupApiMocks();
  setMockApiDelay(750);
  return <WaitForMockApi>{app}</WaitForMockApi>;
}

ReactDOM.render(
  <React.StrictMode>{renderApp()}</React.StrictMode>,
  document.getElementById('root')
);

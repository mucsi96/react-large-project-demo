import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setMockApiDelay } from 'mock-api';
import { setupWorker } from 'msw';
import { mockFriendHandlers } from 'friends-api';

import './index.css';

if (process.env.REACT_APP_USE_MOCK_API === 'true') {
  const worker = setupWorker(...mockFriendHandlers);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  worker.start();
  setMockApiDelay(750);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

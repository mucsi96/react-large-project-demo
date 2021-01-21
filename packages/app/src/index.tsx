import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { setupApiMocks } from 'ui-lib';
import { WaitForMockApi } from 'dev-tools';

let app = <App />;

if (process.env.USE_MOCK_API || process.env.NODE_ENV === 'development') {
  setupApiMocks();
  // eslint-disable-next-line import/no-webpack-loader-syntax, @typescript-eslint/no-var-requires
  const serviceWorkerPath = (require('file-loader?name=[name].[ext]!dev-tools/lib/mockApi/mockApiServiceWorker') as {
    default: string;
  }).default;
  app = (
    <WaitForMockApi serviceWorkerPath={serviceWorkerPath}>{app}</WaitForMockApi>
  );
}

ReactDOM.render(
  <React.StrictMode>{app}</React.StrictMode>,
  document.getElementById('root')
);

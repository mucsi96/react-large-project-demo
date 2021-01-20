import React from 'react';
import { WaitForMockApi } from 'dev-tools';
import { Story } from '@storybook/react';

// eslint-disable-next-line import/no-webpack-loader-syntax, @typescript-eslint/no-var-requires
const serviceWorkerPath = (require('file-loader?name=[name].[ext]!dev-tools/lib/mockApi/mockApiServiceWorker') as {
  default: string;
}).default;

export const decorators = [
  (Story: Story) => (
    <WaitForMockApi serviceWorkerPath={serviceWorkerPath}>
      <Story />
    </WaitForMockApi>
  ),
];

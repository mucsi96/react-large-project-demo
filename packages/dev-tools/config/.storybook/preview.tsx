import React from 'react';
import { WaitForMockApi } from 'dev-tools';
import { Story } from '@storybook/react';

export const decorators = [
  (Story: Story) => (
    <WaitForMockApi>
      <Story />
    </WaitForMockApi>
  ),
];

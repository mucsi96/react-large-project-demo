import React from 'react';
import { setMockApiDelay, WaitForMockApi } from 'dev-tools';
import { Story } from '@storybook/react';
import './preview.scss';

setMockApiDelay(750);

export const decorators = [
  (Story: Story) => (
    <WaitForMockApi>
      <Story />
    </WaitForMockApi>
  ),
];

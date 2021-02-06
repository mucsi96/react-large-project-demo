import React from 'react';
import { setMockApiDelay, WaitForMockApi } from 'mock-api';
import { Story } from '@storybook/react';
import './preview.scss';

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('no-delay')) {
  setMockApiDelay(750);
}

export const decorators = [
  (Story: Story) => (
    <WaitForMockApi>
      <Story />
    </WaitForMockApi>
  ),
];

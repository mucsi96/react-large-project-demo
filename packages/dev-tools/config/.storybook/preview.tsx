import { setMockApiDelay } from 'mock-api';
import { addDecorator } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import './preview.scss';

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('no-delay')) {
  setMockApiDelay(750);
}

initialize();
addDecorator(mswDecorator);

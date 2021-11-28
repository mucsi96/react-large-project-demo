import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders list of friends', async () => {
  const { findByText, getByText } = render(<App />);
  await findByText('Alyson Donnelly');
  expect(getByText('Carlee Kreiger')).toBeDefined();
});

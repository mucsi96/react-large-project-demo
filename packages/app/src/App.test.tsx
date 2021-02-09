import { shallow } from 'enzyme';
import React from 'react';
import App from './App';

jest.mock('friends', () => {
  const actual = jest.requireActual<Record<string, unknown>>('friends');

  return {
    ...actual,
    FriendsList: 'FriendsList-',
  };
});

test('renders learn react link', () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});

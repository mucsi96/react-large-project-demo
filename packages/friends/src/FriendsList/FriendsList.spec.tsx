import React from 'react';
import { mount } from 'enzyme';
import { FriendsList } from './FriendsList';
import { act } from 'react-dom/test-utils';
import { setupApiMocks } from '../setupApiMocks';

jest.mock('core', () => {
  const actual = jest.requireActual<Record<string, unknown>>('core');

  return {
    ...actual,
    Spinner: 'Spinner-',
  };
});

setupApiMocks();

describe('FriendsList', () => {
  test('renders spinner during loading of friends', () => {
    const wrapper = mount(<FriendsList />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders list of friends', async () => {
    const wrapper = mount(<FriendsList />);
    await act(() => Promise.resolve());
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});

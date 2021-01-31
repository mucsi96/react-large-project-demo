import React from 'react';
import { mount } from 'enzyme';
import { FriendsList } from './FriendsList';
import { setupApiMocks } from 'friends-api';
import { act } from 'react-dom/test-utils';
import { setMockSwitch } from 'dev-tools';

setupApiMocks();

describe('FriendsList', () => {
  test('renders loading text on loading friends', () => {
    const wrapper = mount(<FriendsList />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders list of friends', async () => {
    const wrapper = mount(<FriendsList />);

    await act(() => Promise.resolve());
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  test('renders message if no friends are found', async () => {
    setMockSwitch('friends', 'empty');
    const wrapper = mount(<FriendsList />);

    await act(() => Promise.resolve());
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  test('renders error message in case of error', async () => {
    setMockSwitch('friends', 'failure');
    const wrapper = mount(<FriendsList />);

    await act(() => Promise.resolve());
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });
});

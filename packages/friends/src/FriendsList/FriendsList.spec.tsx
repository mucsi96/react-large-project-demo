import React from 'react';
import { mount } from 'enzyme';
import { FriendsList } from './FriendsList';
import { act } from 'react-dom/test-utils';
import { setupApiMocks } from '../setupApiMocks';
import { setMockSwitch } from 'dev-tools';

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
    const wrapper = await renderFriends();
    expect(wrapper).toMatchSnapshot();
  });

  test('renders error message in case of loading failure', async () => {
    setMockSwitch('friends', 'processingFailure');
    const wrapper = await renderFriends();
    expect(wrapper).toMatchSnapshot();
  });
});

async function renderFriends() {
  const wrapper = mount(<FriendsList />);
  await act(() => Promise.resolve());
  wrapper.update();
  return wrapper;
}

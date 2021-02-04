import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { FriendsList } from './FriendsList';
import { act } from 'react-dom/test-utils';
import { setupApiMocks } from '../setupApiMocks';
import { setMockSwitch } from 'dev-tools';

jest.mock('core', () => {
  const actual = jest.requireActual<Record<string, unknown>>('core');

  return {
    ...actual,
    Spinner: 'Spinner-',
    Button: 'Button-',
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

  test('shows loading message on clicking load more button', async () => {
    const wrapper = await renderFriends();
    act(() => {
      loadMore(wrapper);
    });
    wrapper.update();
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(5);
    expect(wrapper.find('[data-name="loading"]').exists()).toBe(true);
  });

  test('loads more friends clicking load more button', async () => {
    const wrapper = await renderFriends();
    await act(async () => {
      loadMore(wrapper);
      await Promise.resolve();
    });
    wrapper.update();
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(10);
    expect(wrapper.find('[data-name="load-more"]').exists()).toBe(true);
  });

  test('shows no load more button if all friends are loaded', async () => {
    const wrapper = await renderFriends();
    await act(async () => {
      loadMore(wrapper);
      await Promise.resolve();
    });
    wrapper.update();
    await act(async () => {
      loadMore(wrapper);
      await Promise.resolve();
    });
    wrapper.update();
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(15);
    expect(wrapper.find('[data-name="load-more"]').exists()).toBe(false);
  });
});

async function renderFriends() {
  const wrapper = mount(<FriendsList />);
  await act(() => Promise.resolve());
  wrapper.update();
  return wrapper;
}

function loadMore(wrapper: ReactWrapper) {
  act(() => {
    wrapper.find('[data-name="load-more"]').simulate('click');
  });
}

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { FriendsList } from './FriendsList';
import { act } from 'react-dom/test-utils';
import { setupApiMocks } from '../setupApiMocks';
import { FriendsMockSwitch, setFriendsMockSwitch } from 'friends-api';
import { fetchJSON, Spinner } from 'core';

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
  test('renders spinner during loading of friends', async () => {
    const wrapper = mount(<FriendsList callApi={fetchJSON} />);
    await act(() => Promise.resolve());
    expect(wrapper.children()).toMatchSnapshot();
  });

  test('renders list of friends', async () => {
    const wrapper = await renderFriends();
    expect(wrapper.children()).toMatchSnapshot();
  });

  test('renders error message in case of loading failure', async () => {
    setFriendsMockSwitch(FriendsMockSwitch.LOADING_FAILURE);
    const wrapper = await renderFriends();
    expect(wrapper.children()).toMatchSnapshot();
  });

  test('shows spinner on clicking load more button', async () => {
    const wrapper = await renderFriends();
    act(() => loadMore(wrapper));
    wrapper.update();
    await act(() => Promise.resolve());
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(5);
    expect(wrapper.find(Spinner).exists()).toBe(true);
  });

  test('loads more friends clicking load more button', async () => {
    const wrapper = await renderFriends();
    act(() => loadMore(wrapper));
    await act(() => Promise.resolve());
    wrapper.update();
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(10);
    expect(wrapper.find('[data-name="load-more"]').exists()).toBe(true);
  });

  test('shows no load more button if all friends are loaded', async () => {
    const wrapper = await renderFriends();
    act(() => loadMore(wrapper));
    await act(() => Promise.resolve());
    wrapper.update();
    act(() => loadMore(wrapper));
    await act(() => Promise.resolve());
    wrapper.update();
    expect(wrapper.find('[data-name="friend"]')).toHaveLength(15);
    expect(wrapper.find('[data-name="load-more"]').exists()).toBe(false);
  });

  test('adds friend as favorite by clicking on "Add to favorite" button', async () => {
    const wrapper = await renderFriends();
    await addToFavorite(wrapper, 1);
    expect(isFavorite(wrapper, 1)).toBe(true);
  });

  test('persits favories', async () => {
    await addToFavorite(await renderFriends(), 1);
    const wrapper = await renderFriends();
    expect(isFavorite(wrapper, 1)).toBe(true);
  });

  test('remove friend from favorite by clicking on "Remove from favorite" button', async () => {
    await addToFavorite(await renderFriends(), 1);
    const wrapper = await renderFriends();
    await removeFromFavorite(wrapper, 1);
    expect(isNotFavorite(wrapper, 1)).toBe(true);
  });
});

async function renderFriends() {
  const wrapper = mount(<FriendsList callApi={fetchJSON} />);
  await act(() => Promise.resolve());
  wrapper.update();
  return wrapper;
}

function loadMore(wrapper: ReactWrapper) {
  act(() => {
    wrapper.find('[data-name="load-more"]').simulate('click');
  });
}

function isFavorite(wrapper: ReactWrapper, index: number): boolean {
  return wrapper
    .find('[data-name="friend"]')
    .at(index)
    .find('[data-name="remove-from-favorite"]')
    .exists();
}

function isNotFavorite(wrapper: ReactWrapper, index: number): boolean {
  return wrapper
    .find('[data-name="friend"]')
    .at(index)
    .find('[data-name="add-to-favorite"]')
    .exists();
}

async function addToFavorite(wrapper: ReactWrapper, index: number) {
  await act(() => {
    wrapper
      .find('[data-name="friend"]')
      .at(index)
      .find('[data-name="add-to-favorite"]')
      .simulate('click');
    return Promise.resolve();
  });

  wrapper.update();
}

async function removeFromFavorite(wrapper: ReactWrapper, index: number) {
  await act(() => {
    wrapper
      .find('[data-name="friend"]')
      .at(index)
      .find('[data-name="remove-from-favorite"]')
      .simulate('click');
    return Promise.resolve();
  });

  wrapper.update();
}

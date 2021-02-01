import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { FriendsList } from './FriendsList';
import { setupApiMocks } from 'friends-api';
import { act } from 'react-dom/test-utils';
import { setMockSwitch } from 'dev-tools';

jest.mock('../Button', () => ({
  Button: 'Button-',
}));

setupApiMocks();

async function renderFriends() {
  const wrapper = mount(<FriendsList />);

  await act(() => Promise.resolve());
  wrapper.update();
  return wrapper;
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

describe('FriendsList', () => {
  test('renders loading text on loading friends', () => {
    const wrapper = mount(<FriendsList />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders list of friends', async () => {
    const wrapper = await renderFriends();
    expect(wrapper).toMatchSnapshot();
  });

  test('renders message if no friends are found', async () => {
    setMockSwitch('friends', 'empty');
    const wrapper = await renderFriends();
    expect(wrapper).toMatchSnapshot();
  });

  test('renders error message in case of error', async () => {
    setMockSwitch('friends', 'failure');
    const wrapper = await renderFriends();
    expect(wrapper).toMatchSnapshot();
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

import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { fetchJSON } from 'core';
import { FriendsMockSwitch, setFriendsMockSwitch } from 'friends-api';
import React from 'react';
import { FriendsList } from './FriendsList';

function renderFriends() {
  return render(<FriendsList callApi={fetchJSON} />);
}

async function loadMore() {
  fireEvent.click(await screen.findByText('Load more...'));
}

function isFavorite(index: number): boolean {
  const friend = screen.getAllByTestId('friend');
  const button = within(friend[index]).queryByText('Remove from favorite');
  return !!button && button.getAttribute('disabled') === null;
}

function isNotFavorite(index: number): boolean {
  const friend = screen.getAllByTestId('friend');
  const button = within(friend[index]).queryByText('Add to favorite');
  return !!button && button.getAttribute('disabled') === null;
}

function addToFavorite(index: number) {
  const friend = screen.getAllByTestId('friend');
  fireEvent.click(within(friend[index]).getByText('Add to favorite'));
}

function removeFromFavorite(index: number) {
  const friend = screen.getAllByTestId('friend');
  fireEvent.click(within(friend[index]).getByText('Remove from favorite'));
}

describe('FriendsList', () => {
  test('renders spinner during loading of friends', async () => {
    const { findByTestId } = renderFriends();
    await waitFor(() => findByTestId('spinner'));
    await waitFor(() => findByTestId('friend-list'));
  });

  test('renders list of friends', async () => {
    const { findByText } = renderFriends();
    await expect(findByText('Alyson Donnelly')).resolves.toBeDefined();
    await expect(findByText('Carlee Kreiger')).resolves.toBeDefined();
    await expect(findByText('Enrico Pouros')).resolves.toBeDefined();
    await expect(findByText('Patricia Barrows')).resolves.toBeDefined();
    await expect(findByText('Steven Bergstrom')).resolves.toBeDefined();
  });

  test('renders error message in case of loading failure', async () => {
    setFriendsMockSwitch(FriendsMockSwitch.LOADING_FAILURE);
    const { findByText } = renderFriends();
    await expect(
      findByText("We couldn't process your request at this time Status: 500")
    ).resolves.toBeDefined();
  });

  test('shows spinner on clicking load more button', async () => {
    const { findByTestId, findAllByTestId } = renderFriends();
    await loadMore();

    await waitFor(() => findByTestId('spinner'));
    await expect(findAllByTestId('friend')).resolves.toHaveLength(5);
  });

  test('loads more friends clicking load more button', async () => {
    const { findByText, findAllByTestId } = renderFriends();
    await loadMore();
    await waitFor(() =>
      expect(findAllByTestId('friend')).resolves.toHaveLength(10)
    );
    await expect(findByText('Load more...')).resolves.toBeDefined();
  });

  test('shows no load more button if all friends are loaded', async () => {
    const { queryByText, findAllByTestId } = renderFriends();
    await loadMore();
    await waitFor(() =>
      expect(findAllByTestId('friend')).resolves.toHaveLength(10)
    );
    await loadMore();
    await waitFor(() =>
      expect(findAllByTestId('friend')).resolves.toHaveLength(10)
    );
    expect(queryByText('Load more...')).toBeNull();
  });

  test('adds friend as favorite by clicking on "Add to favorite" button', async () => {
    renderFriends();
    await screen.findByText('Load more...');
    addToFavorite(1);
    await waitFor(() => expect(isFavorite(1)).toBe(true));
  });

  test('persits favories', async () => {
    const { unmount } = renderFriends();
    await screen.findByText('Load more...');
    addToFavorite(1);
    await waitFor(() => expect(isFavorite(1)).toBe(true));
    unmount();
    renderFriends();
    await screen.findByText('Load more...');
    await waitFor(() => expect(isFavorite(1)).toBe(true));
  });

  test('remove friend from favorite by clicking on "Remove from favorite" button', async () => {
    renderFriends();
    await screen.findByText('Load more...');
    addToFavorite(1);
    await waitFor(() => expect(isFavorite(1)).toBe(true));
    removeFromFavorite(1);
    await waitFor(() => expect(isNotFavorite(1)).toBe(true));
  });
});

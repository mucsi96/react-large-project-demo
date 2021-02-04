import React from 'react';
import { mount } from 'enzyme';
import { FriendsList } from './FriendsList';
import { act } from 'react-dom/test-utils';
import { setupApiMocks } from '../setupApiMocks';

setupApiMocks();

describe('FriendsList', () => {
  test('renders list of friends', async () => {
    const wrapper = mount(<FriendsList />);
    await act(() => Promise.resolve());
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});

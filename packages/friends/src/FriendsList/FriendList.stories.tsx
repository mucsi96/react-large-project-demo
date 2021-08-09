import { Meta, Story } from '@storybook/react';
import React from 'react';
import { FriendsList } from './FriendsList';
import {
  FriendsMockSwitch,
  mockFriendHandlers,
  setFriendsMockSwitch,
} from 'friends-api';
import { useState } from 'react';
import { rxFetchJSON } from 'core';
import { fetchJSON } from 'core';

type StoryProps = { friendsMock: FriendsMockSwitch };

export default { title: 'FriendsList', component: FriendsList } as Meta;

const Template: Story<StoryProps> = ({ friendsMock, ...args }) => {
  const [count, setCount] = useState(0);
  setFriendsMockSwitch(friendsMock);
  return (
    <>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        style={{ position: 'fixed', right: 10, top: 10 }}
      >
        {'Remount'}
      </button>
      <FriendsList callApi={rxFetchJSON} {...args} key={count} />
    </>
  );
};

function createStory(args: StoryProps) {
  const story = Template.bind({});
  story.args = args;
  story.parameters = {
    msw: [...mockFriendHandlers],
  };
  return story;
}

export const normal = createStory({
  friendsMock: FriendsMockSwitch.NORMAL,
});

export const empty = createStory({
  friendsMock: FriendsMockSwitch.EMPTY,
});

export const loadingFailure = createStory({
  friendsMock: FriendsMockSwitch.LOADING_FAILURE,
});

export const processingFailure = createStory({
  friendsMock: FriendsMockSwitch.PROCESSING_FAILURE,
});

export const slow = createStory({
  friendsMock: FriendsMockSwitch.SLOW,
});

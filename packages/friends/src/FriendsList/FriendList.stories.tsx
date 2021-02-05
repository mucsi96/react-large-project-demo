import { Meta, Story } from '@storybook/react';
import React from 'react';
import { setupApiMocks } from '../setupApiMocks';
import { FriendsList } from './FriendsList';
import { FriendsMockSwitch, setFriendsMockSwitch } from 'friends-api';

type StoryProps = { friendsMock: FriendsMockSwitch };

setupApiMocks();

export default { title: 'FriendsList', component: FriendsList } as Meta;

const Template: Story<StoryProps> = ({ friendsMock, ...args }) => {
  setFriendsMockSwitch(friendsMock);
  return <FriendsList {...args} />;
};

function createStory(args: StoryProps) {
  const story = Template.bind({});
  story.args = args;
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

import { Meta, Story } from '@storybook/react';
import React from 'react';
import { setupApiMocks } from '../../setupApiMocks';
import { FriendsList } from './FriendsList';
import { setMockSwitch } from 'dev-tools';

type StoryProps = { friendsMock: string };

setupApiMocks();

export default { title: 'FriendsList', component: FriendsList } as Meta;

const Template: Story<StoryProps> = ({ friendsMock, ...args }) => {
  setMockSwitch('friends', friendsMock);
  return <FriendsList {...args} />;
};

function createStory(args: StoryProps) {
  const story = Template.bind({});
  story.args = args;
  return story;
}

export const normal = createStory({
  friendsMock: 'normal',
});

export const empty = createStory({
  friendsMock: 'empty',
});

export const failure = createStory({
  friendsMock: 'failure',
});

export const slow = createStory({
  friendsMock: 'slow',
});

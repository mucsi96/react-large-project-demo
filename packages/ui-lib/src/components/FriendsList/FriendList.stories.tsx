import { Meta, Story } from '@storybook/react';
import React from 'react';
import { setupApiMocks } from '../../setupApiMocks';
import { FriendsList } from './FriendsList';

setupApiMocks();

export default { title: 'FriendsList', component: FriendsList } as Meta;

const Template: Story = (args) => <FriendsList {...args} />;

export const withText = Template.bind({});

withText.args = {
  children: 'Hello Button',
};

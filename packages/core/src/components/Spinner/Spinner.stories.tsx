import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Spinner } from './Spinner';

export default { title: 'Spinner', component: Spinner } as Meta;

const Template: Story = (args) => <Spinner {...args} />;

function createStory() {
  const story = Template.bind({});
  return story;
}

export const normal = createStory();

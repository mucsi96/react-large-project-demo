import { Meta, Story } from '@storybook/react';
import React, { ReactNode } from 'react';
import { Button, ButtonProps } from './Button';

type StoryProps = ButtonProps | { children: ReactNode };

export default { title: 'Button', component: Button } as Meta;

const Template: Story<StoryProps> = (args) => <Button {...args} />;

function createStory(args: StoryProps) {
  const story = Template.bind({});
  story.args = args;
  return story;
}

export const withText = createStory({
  children: 'Hello Button',
});

export const withEmoji = createStory({
  children: '😀 😎 👍 💯',
});

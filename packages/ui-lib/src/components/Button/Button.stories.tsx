import { Meta, Story } from "@storybook/react";
import React, { ReactNode } from "react";
import { Button, ButtonProps } from "./Button";

export default { title: "Button", component: Button } as Meta;

const Template: Story<ButtonProps | { children: ReactNode }> = (args) => (
  <Button {...args} />
);

export const withText = Template.bind({});

withText.args = {
  children: "Hello Button",
};

export const withEmoji = Template.bind({});

withEmoji.args = {
  children: "😀 😎 👍 💯",
};

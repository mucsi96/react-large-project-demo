import { Meta, Story } from "@storybook/react";
import React from "react";
import { FriendsList } from "./FriendsList";
import "../../setupApiMocks";

export default { title: "FriendsList", component: FriendsList } as Meta;

const Template: Story = (args) => <FriendsList {...args} />;

export const withText = Template.bind({});

withText.args = {
  children: "Hello Button",
};

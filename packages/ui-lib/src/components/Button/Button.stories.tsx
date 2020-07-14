import { action } from "@storybook/addon-actions";
import React from "react";
import { Button } from "./Button";

export default { title: "Button", component: Button };

export const withText = () => (
  <Button onClick={action("clicked")}>Hello Button</Button>
);

export const withEmoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

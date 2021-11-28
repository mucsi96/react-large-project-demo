import React from "react";
import { Button } from "./Button";
import { render } from '@testing-library/react';

test("render", () => {
  const { asFragment } = render(<Button onClick={jest.fn()} primary />);
  expect(asFragment()).toMatchSnapshot();
});

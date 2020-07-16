import { shallow } from "enzyme";
import React from "react";
import { Button } from "./Button";

test("render", () => {
  const wrapper = shallow(<Button onClick={jest.fn()} />);
  expect(wrapper).toMatchSnapshot();
});

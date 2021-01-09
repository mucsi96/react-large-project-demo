import React, { FC } from "react";

export type ButtonProps = {
  /**
   * Simple click handler
   */
  onClick?: () => void;

  /**
   * Is primary?
   */
  primary?: boolean;

  /**
   * default is false
   */
  secondary?: boolean;
};

export const Button: FC<ButtonProps> = ({ children, onClick }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './Button.module.css';

export type ButtonProps = {
  disabled?: boolean;
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

export const Button: FC<ButtonProps> = ({
  children,
  disabled,
  primary,
  secondary,
  ...props
}) => (
  <button
    {...props}
    type="button"
    className={classNames(styles.container, {
      [styles.primary]: primary,
      [styles.secondary]: secondary,
      [styles.disabled]: disabled,
    })}
    disabled={disabled}
  >
    {children}
  </button>
);

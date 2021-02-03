import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './Button.module.scss';

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
  onClick,
  disabled,
  primary,
  secondary,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(styles.container, {
      [styles.primary]: primary,
      [styles.secondary]: secondary,
    })}
    disabled={disabled}
  >
    {children}
  </button>
);

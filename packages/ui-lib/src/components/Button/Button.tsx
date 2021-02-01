import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './Button.module.scss';

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

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
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
  >
    {children}
  </button>
);

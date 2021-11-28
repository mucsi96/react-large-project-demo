import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './Spinner.module.css';

export const Spinner: FC = (props) => (
  <div {...props} className={styles.container} data-testid="spinner">
    <div className={classNames(styles.bar, styles.bar1)}></div>
    <div className={classNames(styles.bar, styles.bar2)}></div>
    <div className={classNames(styles.bar, styles.bar3)}></div>
    <div className={classNames(styles.bar, styles.bar4)}></div>
    <div className={classNames(styles.bar, styles.bar5)}></div>
  </div>
);

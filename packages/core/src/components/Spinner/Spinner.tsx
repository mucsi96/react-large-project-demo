import React, { FC } from 'react';
import styles from './Spinner.module.scss';

export const Spinner: FC = (props) => (
  <div {...props} className={styles.container}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

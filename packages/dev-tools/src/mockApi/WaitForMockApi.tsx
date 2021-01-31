import React, { FC, useState, useEffect } from 'react';
import { enableSwMockApi } from './swMockApi';

export const WaitForMockApi: FC = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    enableSwMockApi()
      .then(() => setReady(true))
      .catch((error) =>
        setReady(() => {
          throw error;
        })
      );
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
};

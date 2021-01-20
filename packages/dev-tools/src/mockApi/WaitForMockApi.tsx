import React, { FC, useState, useEffect } from 'react';
import { enableMockApi } from './mockApi';

export const WaitForMockApi: FC<{ serviceWorkerPath: string }> = ({
  children,
  serviceWorkerPath,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    enableMockApi(serviceWorkerPath)
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

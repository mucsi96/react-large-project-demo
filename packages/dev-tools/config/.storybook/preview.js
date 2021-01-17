import React, { useState, useEffect } from "react";

const WaitForMockApi = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready.then(() => setReady(true));
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
};

export const decorators = [
  (Story) => (
    <WaitForMockApi>
      <Story />
    </WaitForMockApi>
  ),
];

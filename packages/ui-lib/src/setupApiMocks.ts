import { registerApiMocks } from "dev-tools";

registerApiMocks([
  {
    path: "/friends",
    callback: () => ["Tom", "John", "Alex"],
  },
]);

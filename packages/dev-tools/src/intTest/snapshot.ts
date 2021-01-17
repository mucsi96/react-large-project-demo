import { Config } from "@jest/types";
import expect from "expect";
import {
  buildSnapshotResolver,
  SnapshotState,
  toMatchSnapshot as jestMatchSnapshot,
} from "jest-snapshot";
import { relative } from "path";
import { getTestContext } from "./cucumberConfig";

export function toMatchSnapshot(received: unknown, name: string) {
  const snapshotResolver = buildSnapshotResolver({
    rootDir: "test",
  } as Config.ProjectConfig);

  const { fileName, testName } = getTestContext();
  const snapshotFile = snapshotResolver.resolveSnapshotPath(fileName);
  const updateSnapshot = !!process.env.SNAPSHOT_UPDATE;

  const snapshotState = new SnapshotState(snapshotFile, {
    updateSnapshot: updateSnapshot ? "all" : "new",
    getPrettier: () => null,
    getBabelTraverse: () => null as any,
  });

  const result = jestMatchSnapshot.call(
    {
      snapshotState,
      currentTestName: testName,
    } as any,
    received,
    name || ""
  );

  snapshotState.save();

  if (snapshotState.updated) {
    console.log(
      `Snapshot ${relative(process.cwd(), snapshotFile)}:${testName} updated.`
    );
  }

  return result;
}

expect.extend({
  toMatchSnapshot,
});

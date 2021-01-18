import { Config } from "@jest/types";
import expect from "expect";
import {
  buildSnapshotResolver,
  SnapshotState,
  toMatchSnapshot as jestMatchSnapshot,
} from "jest-snapshot";
import { Context, ExpectationResult } from "jest-snapshot/build/types";
import { relative } from "path";
import { getTestContext } from "./cucumberConfig";

export function toMatchSnapshot(
  received: unknown,
  name: string
): ExpectationResult {
  const snapshotResolver = buildSnapshotResolver({
    rootDir: "test",
  } as Config.ProjectConfig);

  const { fileName, testName } = getTestContext();

  if (!fileName || !testName) {
    return {
      pass: false,
      message: () => "missing test context",
    };
  }

  const snapshotFile = snapshotResolver.resolveSnapshotPath(fileName);
  const updateSnapshot = !!process.env.SNAPSHOT_UPDATE;

  const snapshotState = new SnapshotState(snapshotFile, {
    updateSnapshot: updateSnapshot ? "all" : "new",
    getPrettier: () => null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    getBabelTraverse: () => null as any,
  });

  const result = jestMatchSnapshot.call(
    {
      snapshotState,
      currentTestName: testName,
    } as Context,
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

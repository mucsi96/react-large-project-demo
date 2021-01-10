import { join } from "path";

export function runPackageBinary({
  packageName,
  binaryName,
  args,
}: {
  packageName: string;
  binaryName?: string;
  args: string[];
}) {
  const packageJson = require(`${packageName}/package.json`);
  const binaryPath = binaryName ? packageJson.bin[binaryName] : packageJson.bin;

  if (typeof binaryPath !== "string") {
    throw new Error(`Wrong binaryPath ${binaryPath}`);
  }

  process.argv = [
    ...process.argv.slice(0, 2),
    ...args,
    ...process.argv.slice(3),
  ];

  require(join(packageName, binaryPath));
}

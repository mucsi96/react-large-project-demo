import { join } from "path";
import { exit } from "process";

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
    console.error(`Wrong binaryPath ${binaryPath} in package ${packageName}`);
    exit(1);
  }

  process.argv = [
    ...process.argv.slice(0, 2),
    ...args,
    ...process.argv.slice(3),
  ];

  require(join(packageName, binaryPath));
}

export function pickCommand(
  commands: Record<string, Function>,
  command: string
): void {
  const commandFunction = commands[command];

  if (!commandFunction) {
    console.error(
      `Usage: dev-tools ${Object.keys(commands).join(
        "|"
      )} [additional options...]`
    );
    exit(1);
  }

  commandFunction();
}

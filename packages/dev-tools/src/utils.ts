import { join, resolve } from "path";
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

export function runReactScripts(script: string, args: string[] = []) {
  process.env.BROWSERSLIST_CONFIG = resolve(
    __dirname,
    "../config/.browserslistrc"
  );

  runPackageBinary({
    packageName: "react-app-rewired",
    binaryName: "react-app-rewired",
    args: [
      script,
      "--config-overrides",
      resolve(__dirname, "../config/cra-config-overrides.js"),
      ...args,
    ],
  });
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

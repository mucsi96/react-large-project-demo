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
}): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(`${packageName}/package.json`) as {
    bin: string | Record<string, string>;
  };
  const binaryPath = binaryName
    ? (packageJson.bin as Record<string, string>)[binaryName]
    : packageJson.bin;

  if (typeof binaryPath !== "string") {
    console.error(`Wrong binaryPath in package ${packageName}`);
    exit(1);
  }

  process.argv = [
    ...process.argv.slice(0, 2),
    ...args,
    ...process.argv.slice(3),
  ];

  require(join(packageName, binaryPath));
}

export function runReactScripts(script: string, args: string[] = []): void {
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
  commands: Record<string, () => void>,
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

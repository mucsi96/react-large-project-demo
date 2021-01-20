import { readFileSync } from 'fs';
import { join, resolve, sep } from 'path';
import { exit } from 'process';

export function runPackageBinary({
  packageName,
  binaryName,
  args,
}: {
  packageName: string;
  binaryName?: string;
  args: string[];
}): void {
  const packageJson = getPackageJson(packageName);
  const binaryPath = binaryName
    ? (packageJson.bin as Record<string, string>)[binaryName]
    : packageJson.bin;

  if (typeof binaryPath !== 'string') {
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

function getPackageJson(packageName: string) {
  const searchSubPath = ['node_modules', ...packageName.split(/[\\/]/)];
  const entryPointPath = require.resolve(packageName).split(/[\\/]/);
  const matchIndex = entryPointPath.findIndex(
    (_entryPointPathItem, entryPointPathIndex) =>
      searchSubPath.every(
        (searchSubPathItem, searchSubPathIndex) =>
          searchSubPathItem ===
          entryPointPath[entryPointPathIndex + searchSubPathIndex]
      )
  );

  if (matchIndex === -1) {
    throw new Error(`Cannot resolve package path for ${packageName}`);
  }
  const packagePath = entryPointPath
    .slice(0, matchIndex + searchSubPath.length)
    .join(sep);

  return JSON.parse(
    readFileSync(resolve(packagePath, 'package.json'), {
      encoding: 'utf8',
    })
  ) as {
    bin: string | Record<string, string>;
  };
}

export function runReactScripts(script: string, args: string[] = []): void {
  process.env.BROWSERSLIST_CONFIG = resolve(
    __dirname,
    '../config/.browserslistrc'
  );

  runPackageBinary({
    packageName: 'react-app-rewired',
    binaryName: 'react-app-rewired',
    args: [
      script,
      '--config-overrides',
      resolve(__dirname, '../config/cra-config-overrides.js'),
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
        '|'
      )} [additional options...]`
    );
    exit(1);
  }

  commandFunction();
}

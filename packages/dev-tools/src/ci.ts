import { execSync } from "child_process";
import { readdirSync } from "fs";
import { resolve } from "path";
import { runPackageBinary } from "./utils";

export function run() {
  const [, , , headRef, baseRef] = process.argv;

  const packages: string[] = getPackages();
  const changedPackages = getChangedPackages(packages, headRef, baseRef);
  const packageDepndencies = getPackageDependencies(packages);
  const affectedPackages = getAffectedPackages(
    changedPackages,
    packageDepndencies
  );

  process.argv = [process.argv[0], process.argv[1]];

  runPackageBinary({
    packageName: "lerna",
    binaryName: "lerna",
    args: [
      "run",
      ...affectedPackages.flatMap((name) => ["--scope", name]),
      "ci",
    ],
  });
}

function getPackages(): string[] {
  return readdirSync(resolve(process.cwd(), "packages"), {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getChangedPackages(
  packages: string[],
  headRef: string,
  baseRef: string
) {
  return packages.filter((name) => {
    try {
      execSync(`git diff --quiet ${headRef} ${baseRef} -- packages/${name}`, {
        encoding: "utf8",
      });
      return false;
    } catch {
      return true;
    }
  });
}

function getPackageDependencies(packages: string[]) {
  return packages.map((name) => {
    const {
      dependencies = {},
      devDependencies = {},
    } = require(`${name}/package.json`);
    return {
      name,
      dependencies: [
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies),
      ].filter((name) => packages.includes(name)),
    };
  });
}

function getAffectedPackages(
  changedPackages: string[],
  packageDepndencies: { name: string; dependencies: string[] }[]
) {
  let lastSize = 0;
  let affectedPackages = new Set(changedPackages);

  while (lastSize !== affectedPackages.size) {
    lastSize = affectedPackages.size;
    affectedPackages.forEach((name) => {
      getDependentPackages(
        name,
        packageDepndencies
      ).forEach((dependentPackage) => affectedPackages.add(dependentPackage));
    });
  }

  return [...affectedPackages];
}

function getDependentPackages(
  name: string,
  packageDepndencies: { name: string; dependencies: string[] }[]
) {
  return packageDepndencies
    .filter(({ dependencies }) => dependencies.includes(name))
    .map(({ name }) => name);
}

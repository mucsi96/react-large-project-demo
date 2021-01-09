export function setProcessArgs(args: string[]) {
  process.argv = [
    ...process.argv.slice(0, 2),
    ...args,
    ...process.argv.slice(3),
  ];
}

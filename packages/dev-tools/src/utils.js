const fs = require("fs");

let virtualSymbolicLinks = [];
const originalReadFile = fs.readFileSync;
const originalStatSync = fs.statSync;

function getVirtualSymbolicLink(fileName) {
  return virtualSymbolicLinks.find(({ to }) =>
    to.find((to) => fileName.endsWith(to))
  );
}

fs.statSync = (fileName, options) => {
  if (!getVirtualSymbolicLink(fileName)) {
    return originalStatSync(fileName, options);
  }

  return {
    isFile: () => true,
  };
};

fs.readFileSync = (fileName, encoding) => {
  const symbolicLink = getVirtualSymbolicLink(fileName);

  if (!symbolicLink) {
    return originalReadFile(fileName, encoding);
  }

  return originalReadFile(symbolicLink.from, encoding);
};

function createVirtualSymbolicLink(from, to) {
  virtualSymbolicLinks = [
    ...virtualSymbolicLinks,
    { from, to: [to, to.replace(/\\/g, "/")] },
  ];
}

function setProcessArgs(args) {
  process.argv = [
    ...process.argv.slice(0, 2),
    ...args,
    ...process.argv.slice(3),
  ];
}

module.exports = {
  createVirtualSymbolicLink,
  setProcessArgs,
};

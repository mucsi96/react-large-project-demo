const fs = require("fs");
const Module = require("module");

let virtualSymbolicLinks = [];
const originalExistsSync = fs.existsSync;
const originalStatSync = fs.statSync;
const originalReadFile = fs.readFileSync;
const originalRequire = Module.prototype.require;

function getVirtualSymbolicLink(fileName) {
  return virtualSymbolicLinks.find(({ to }) =>
    to.find((to) => fileName.endsWith(to))
  );
}

fs.existsSync = function(fileName) {
  if (!getVirtualSymbolicLink(fileName)) {
    return originalExistsSync.apply(this, arguments);
  }

  return true;
};

fs.statSync = function(fileName) {
  if (!getVirtualSymbolicLink(fileName)) {
    return originalStatSync.apply(this, arguments);
  }

  return {
    isFile: () => true,
  };
};

fs.readFileSync = function(fileName, encoding) {
  const symbolicLink = getVirtualSymbolicLink(fileName);

  if (!symbolicLink) {
    return originalReadFile.apply(this, arguments);
  }

  return originalReadFile.call(this, symbolicLink.from, encoding);
};

Module.prototype.require = function(id) {
  const symbolicLink = getVirtualSymbolicLink(id);

  if (!symbolicLink) {
    return originalRequire.apply(this, arguments);
  }

  return originalRequire.call(this, symbolicLink.from);
};

function createVirtualSymbolicLink(from, to) {
  const arrayTo = Array.isArray(to) ? to : [to];
  virtualSymbolicLinks = [
    ...virtualSymbolicLinks,
    {
      from,
      to: arrayTo.flatMap((toItem) => [toItem, toItem.replace(/\\/g, "/")]),
    },
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

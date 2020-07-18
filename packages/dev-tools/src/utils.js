const fs = require("fs");
const Module = require("module");
const { resolve } = require("path");

let virtualSymbolicLinks = [];
let virtualFiles = [];
let virtualizetionEnabled = false;
const originalExistsSync = fs.existsSync;
const originalStatSync = fs.statSync;
const originalRealpathSync = fs.realpathSync;
const originalReadFile = fs.readFileSync;
const originalRequire = Module.prototype.require;

function getVirtualSymbolicLink(fileName) {
  return virtualSymbolicLinks.find(({ to }) =>
    to.find((to) => fileName.endsWith(to))
  );
}

function getVirtualFile(fileName) {
  return virtualFiles.find(({ names }) =>
    names.find((name) => fileName.endsWith(name))
  );
}

function enableVirtualization() {
  if (virtualizetionEnabled) {
    return;
  }

  fs.existsSync = function(fileName) {
    if (!getVirtualSymbolicLink(fileName) && !getVirtualFile(fileName)) {
      return originalExistsSync.apply(this, arguments);
    }

    return true;
  };

  fs.statSync = function(fileName) {
    if (!getVirtualSymbolicLink(fileName) && !getVirtualFile(fileName)) {
      return originalStatSync.apply(this, arguments);
    }

    return {
      isFile: () => true,
    };
  };

  fs.realpathSync = function(path, options) {
    const symbolicLink = getVirtualSymbolicLink(path);

    if (!symbolicLink && !getVirtualFile(path)) {
      return originalRealpathSync.apply(this, arguments);
    }

    return symbolicLink
      ? originalRealpathSync.call(this, symbolicLink.to, options)
      : resolve(path);
  };

  fs.readFileSync = function(fileName, encoding) {
    const symbolicLink = getVirtualSymbolicLink(fileName);
    const virtualFile = getVirtualFile(fileName);

    if (!symbolicLink && !virtualFile) {
      return originalReadFile.apply(this, arguments);
    }

    return symbolicLink
      ? originalReadFile.call(this, symbolicLink.from, encoding)
      : virtualFile.content;
  };

  Module.prototype.require = function(id) {
    const symbolicLink = getVirtualSymbolicLink(id);

    if (!symbolicLink) {
      return originalRequire.apply(this, arguments);
    }

    return originalRequire.call(this, symbolicLink.from);
  };

  Module.prototype.require.resolve = function(id) {
    const symbolicLink = getVirtualSymbolicLink(id);

    if (!symbolicLink) {
      return originalRequire.resolve.apply(this, arguments);
    }

    return originalRequire.resolve.call(this, symbolicLink.from);
  };

  virtualizetionEnabled = true;
}

function createVirtualSymbolicLink(from, to) {
  enableVirtualization();
  const arrayTo = Array.isArray(to) ? to : [to];
  virtualSymbolicLinks = [
    ...virtualSymbolicLinks,
    {
      from,
      to: arrayTo.flatMap((toItem) => [toItem, toItem.replace(/\\/g, "/")]),
    },
  ];
}

function createVirtualFile(fileName, content) {
  enableVirtualization();
  virtualFiles = [
    ...virtualFiles,
    {
      names: [fileName, fileName.replace(/\\/g, "/")],
      content,
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
  createVirtualFile,
  setProcessArgs,
};

import { setProcessArgs } from "./utils";

function checkTypes() {
  setProcessArgs([]);

  require("typescript/lib/tsc");
}

export default checkTypes;

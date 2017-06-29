/**
 * @flow
 */

"use strict";

import type { Action } from "../actions/types";

function track(action: Action): void {
  console.log("do nothing now");
}

module.exports = track;

/**
 * Defines the "mutate" multi-method,
 * that describes how to mutate application state.
 *
 * @flow
 */
"use strict";

import d             from "@clockworks/datascript";

import { Mutations } from "./constants";


const mutate = {};

mutate[Mutations.SUBMIT_STATUS] = (target, text) => {
    console.log("submitting ", text)
    d.transact(target.conn, [[":db/add", 42, ":text", text]])
}


export default mutate;
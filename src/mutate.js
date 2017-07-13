/**
 * Defines the "mutate" multi-method,
 * that describes how to mutate application state.
 *
 * @flow
 */
"use strict";

import d             from "@clockworks/datascript";

import { Mutations } from "./constants";

import { Navigator } from "./route";


const mutate = {};

mutate[Mutations.SUBMIT_STATUS] = (target, text) => {
    console.log("submitting ", text)
    d.transact(target.conn, [[":db/add", 42, ":text", text]])
}


const dispatchNavigation = (db, action) => {
    const ui = d.vector("db/ident", ":ui")
    const navigationState = d.get(d.entity(db, ui), "ui/navigationState")
    const nextState = Navigator.router.getStateForAction(d.toJs(action), d.toJs(navigationState))

    return [[":db/add", ui, "ui/navigationState", nextState]]
}

mutate[Mutations.NAVIGATION_DISPATCH] = (target: IReconcilable, action) => d.transact(target.conn, [[":db.fn/call", dispatchNavigation, action]])


export default mutate;

/**
 * Defines the "mutate" multi-method,
 * that describes how to mutate application state.
 *
 * @flow
 */
"use strict";

import d             from "@clockworks/datascript";

import { Mutations,
         RAGs,
         Completeness } from "./constants";

import { Navigator } from "./route";

import read from "./read";

import Moment           from "moment";


const mutate = {};


mutate[Mutations.ADD_SNAP] = (target, taskId, staff, snapshot) => {
    const task = d.q(`[:find ?task . :in $ ?taskId :where [?task "task/id" ?taskId]]`, d.db(target.conn), taskId);

    d.transact(target.conn, [{"task/_snapshot": task,
                              "snapshot/date": {"date/timestamp": snapshot.date},
                              "snapshot/start": {"date/timestamp": snapshot.start},
                              "snapshot/end": {"date/timestamp": snapshot.end},
                              "snapshot/staff": staff,
                              "snapshot/wip": snapshot.wip,
                              "snapshot/title": snapshot.title,
                              "snapshot/completeness": snapshot.completeness,
                              "snapshot/rag": snapshot.rag,
                              //@TODO: further attributes
                              }])
}

mutate[Mutations.CREATE_STATUS] = (target) => {
    const db = d.db(target.conn);
    const currentSnapIds = read["user/currentSnaps"](0, db, d.vector("db/ident", ":user-data"));

    const currentSnaps = d.pull_many(db, `[ { "task/_snapshot" [ :db/id ] }
                                            { "snapshot/date"  [ "date/timestamp" ] }
                                            * ]`, currentSnapIds);

    const snapsToCopy = d.pipeline(currentSnaps,
                                   snaps => d.filter(snap => d.get(snap, "snapshot/completeness") == Completeness.WIP, snaps),
                                   snaps => d.filter(snap => !d.hasKey(snap, "snapshot/isInCreation"), snaps),
                                   snaps => d.map(snap => d.assoc(snap, "snapshot/date", d.hashMap("date/timestamp", Moment().format("x")), 
                                                                        "task/_snapshot", d.getIn(snap, ["task/_snapshot", 0, d.DB_ID]),
                                                                        "snapshot/isInCreation", true), snaps),
                                   snaps => d.map(snap => d.dissoc(snap, d.DB_ID, "snapshot/rag"), snaps));

    if (!d.isEmpty(snapsToCopy))
        d.transact(target.conn, snapsToCopy);
}

mutate[Mutations.SUBMIT_STATUS] = (target, user) => {

}


const dispatchNavigation = (db, action) => {
    const ui = d.vector("db/ident", ":ui")
    const navigationState = d.get(d.entity(db, ui), "ui/navigationState")
    const nextState = Navigator.router.getStateForAction(d.toJs(action), d.toJs(navigationState))

    return [[":db/add", ui, "ui/navigationState", nextState]]
}

mutate[Mutations.NAVIGATION_DISPATCH] = (target: IReconcilable, action) => d.transact(target.conn, [[":db.fn/call", dispatchNavigation, action]])


export default mutate;

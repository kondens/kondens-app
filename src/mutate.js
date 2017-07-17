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

import { NavigationActions } from "react-navigation";

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

mutate[Mutations.UPDATE_STATUS] = (target, snapId, [field, value]) => {
    d.transact(target.conn, [[":db/add", snapId, field, value]])
}

mutate[Mutations.RESET_STATUS] = (target, snapId, field) => {
    d.transact(target.conn, [[":db.fn/retractAttribute", snapId, field]])
}

// mutate[Mutations.SUBMIT_RAG] = (target, rag) => {
//     console.log("submitting ", rag)
//     d.transact(target.conn, [[":db/add", 42, ":text", rag]])
// }

mutate[Mutations.SUBMIT_STATUS] = (target, user) => {

}

mutate[Mutations.INCLUDE_REPORTABLE] = (target, reportableId) => d.transact(target.conn, [[":db.fn/retractAttribute", reportableId, "reportable/isExcluded"]]);

mutate[Mutations.EXCLUDE_REPORTABLE] = (target, reportableId) => d.transact(target.conn, [[":db/add", reportableId, "reportable/isExcluded", true]]);

mutate[Mutations.SHOW_EXCLUDED_REPORTABLES] = target => d.transact(target.conn, [[":db/add", d.vector("db/ident", ":ui"), "ui/showExcludedReportables", true]]);

mutate[Mutations.HIDE_EXCLUDED_REPORTABLES] = target => d.transact(target.conn, [[":db.fn/retractAttribute", d.vector("db/ident", ":ui"), "ui/showExcludedReportables"]]);

const dispatchNavigation = (db, action) => {
    const ui = d.vector("db/ident", ":ui")
    const navigationState = d.get(d.entity(db, ui), "ui/navigationState")
    const nextState = Navigator.router.getStateForAction(NavigationActions.navigate(d.toJs(action)), d.toJs(navigationState))

    return [[":db/add", ui, "ui/navigationState", nextState]]
}

mutate[Mutations.NAVIGATION_DISPATCH] = (target: IReconcilable, action) => d.transact(target.conn, [[":db.fn/call", dispatchNavigation, action]])

export default mutate;

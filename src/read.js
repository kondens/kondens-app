// @flow
"use strict";

import d            from "@clockworks/datascript";

import { DEFAULT }  from "./constants"


// Multi-method that describes how to answer queries for application state.
// All queries involving any logic more complex than a simple sorting, grouping
// or aggregation should be extracted into a read operation.
//
// This keeps components dumb.
//
// Think of read operations as computed datascript attributes.
const read = {}

// By default reads are pull queries on datascript entities.
// e.g. with key ["db/ident", ":user-data"]: d.pull(db, q, ["db/ident", ":user-data"])
read[DEFAULT] = ({db}, key, subQuery) => d.pull(db, subQuery, key);

const taskIds = (db) => d.map((datom) => d.get(datom, "v"), d.datoms(db, ":avet", "task/id"));

const currentSnapForTask = (db, taskId) => {
    const snaps = d.q(`[:find ?time ?snap
                        :in $ ?task-id
                        :where [?task "task/id" ?task-id]
                               [?task "task/snapshot" ?snap]
                               [?snap "snapshot/date" ?date]
                               [?date "date/timestamp" ?time]]`,
                        db, taskId)
    return d.second(d.first(d.sortBy(d.first, (a, b) => (b - a), snaps)));
}

const currentSnaps = (db) => d.map((task) => currentSnapForTask(db, task), taskIds(db));

const allSnapsForName = (db, name) => d.q(`[:find [?snap]
                                            :in $ ?name
                                            :where [?staff "staff/name" ?name]
                                                   [?snap "snapshot/staff" ?staff]]`, 
                                        db, name);

const allSnapsForStaff = (db, staff) => d.q(`[:find [?snap]
                                              :in $ ?staff
                                              :where [?snap "snapshot/staff" ?staff]]`,
                                            db, staff);

const currentSnapsForName = (db, name) => d.intersection(d.set(allSnapsForName(db, name)), d.set(currentSnaps(db)));

const currentSnapsForStaff = (db, staff) => d.intersection(d.set(allSnapsForStaff(db, staff)), d.set(currentSnaps(db)));

const taskIdForSnapId = (db, snapId) => d.q(`[:find ?taskId .
                                              :in $ ?snapId
                                              :where [?task "task/snapshot" ?snapId]
                                                     [?task "task/id" ?taskId]]`,
                                            db, snapId);

read["user/tasks"] = ({db}, key, ident) => {
    const staff = d.get(d.entity(db, d.vector("db/ident", ":user-data")), "user/staff")["eid"];
    const snapIds = currentSnapsForStaff(db, staff);

    //const taskIds = d.map((snapId) => taskIdForSnapId(db, snapId), snapIds);
    const tasks = d.pull_many(db, `[ { "snapshot/date" [ * ] }
                                     { "snapshot/start" [ * ] }
                                     { "snapshot/end" [ * ] }
                                     * ]`, snapIds);

    //return d.zipmap(taskIds, tasks);
    return d.into(d.vector(), tasks)
}

export default read;

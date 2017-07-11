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


export default read;
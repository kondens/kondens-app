"use strict";

import d                from "@clockworks/datascript";

import moment       from "moment";

import { Completeness }    from "./constants";

export const dummyData = [
    {
        "db/ident": ":user-data",
        "user/staff": -2,

    },
    {
        ":db/id": -1,
        "staff/name": "Niko Göbel",
    },
    {
        ":db/id": -2,
        "staff/name": "Malte Sandstede",
    },
    {
        "task/id": 1,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-08-10").format("x")},
            "snapshot/title": "Nikos Architektur-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-20").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.DONE,
        }],
    },
    {
        "task/id": 2,
        "task/snapshot": [
            {
                "snapshot/date": {"date/timestamp": moment("2017-08-10").format("x")},
                "snapshot/title": "Nikos Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-08-30").format("x")},
                "snapshot/staff": -1,
                "snapshot/completeness": Completeness.WIP,
            },
            {
                "snapshot/date": {"date/timestamp": moment("2017-08-22").format("x")},
                "snapshot/title": "Jetzt-Maltes Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-09-05").format("x")},
                "snapshot/staff": -2,
                "snapshot/completeness": Completeness.WIP,
            }]
    },
];

export default dummyData

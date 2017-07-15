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
            "snapshot/date": {"date/timestamp": moment("2017-07-10").format("x")},
            "snapshot/title": "Nikos Architektur-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-20").format("x")},
            "snapshot/staff": -1,
            "snapshot/completeness": Completeness.DONE,
        }],
    },
    {
        ":db/id": -5,
        "task/id": 2,
        "task/snapshot": [
            {
                "snapshot/date": {"date/timestamp": moment("2017-07-10").format("x")},
                "snapshot/title": "Nikos Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-08-30").format("x")},
                "snapshot/staff": -1,
                "snapshot/completeness": Completeness.WIP,
            },
            {
                "snapshot/date": {"date/timestamp": moment("2017-07-11").format("x")},
                "snapshot/title": "Jetzt-Maltes Sales-Pitch",
                "snapshot/start": {"date/timestamp": moment("2017-08-11").format("x")},
                "snapshot/end": {"date/timestamp": moment("2017-09-05").format("x")},
                "snapshot/staff": -2,
                "snapshot/completeness": Completeness.WIP,
            }]
    },
    {
        "task/id": 3,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-12").format("x")},
            "snapshot/title": "Sales-Umbau",
            "snapshot/start": {"date/timestamp": moment("2017-06-25").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-10-01").format("x")},
            "snapshot/staff": -2,
            "snapshot/completeness": Completeness.WIP,
        }],
    },
    {
        "task/id": 4,
        "task/snapshot": [{
            "snapshot/date": {"date/timestamp": moment("2017-07-13").format("x")},
            "snapshot/title": "Stakeholder-Analyse",
            "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
            "snapshot/end": {"date/timestamp": moment("2017-08-01").format("x")},
            "snapshot/staff": -2,
            "snapshot/completeness": Completeness.WIP,
        }],
    },
    // {
    //         "task/_snapshot": -5,
    //         "snapshot/date":  {"date/timestamp": moment("2017-09-10").format("x")},
    //         "snapshot/title": "Jetzt erst recht",
    //         "snapshot/start": {"date/timestamp": moment("2017-07-01").format("x")},
    //         "snapshot/end":   {"date/timestamp": moment("2017-08-01").format("x")},
    //         "snapshot/staff": d.hashMap(d.DB_ID, -2),
    //         "snapshot/completeness": Completeness.WIP,
    // },
];

export default dummyData
